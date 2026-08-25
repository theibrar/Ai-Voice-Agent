package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ramzan/backend-chatbot/internal/config"
	"github.com/ramzan/backend-chatbot/internal/database"
	"github.com/ramzan/backend-chatbot/internal/handlers"
	"github.com/ramzan/backend-chatbot/internal/middleware"
	"github.com/ramzan/backend-chatbot/internal/repository"
	"github.com/ramzan/backend-chatbot/internal/services"
	ws "github.com/ramzan/backend-chatbot/internal/websocket"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	dbPool, err := database.NewPostgresPool(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to Postgres: %v", err)
	}
	defer dbPool.Close()

	redisClient, err := database.NewRedisClient(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redisClient.Close()

	wsHub := ws.NewHub()
	go wsHub.Run()

	leadRepo := repository.NewLeadRepository(dbPool)
	authService := services.NewAuthService(cfg.JWTSecret, cfg.JWTExpirationHours)
	ragService := services.NewRAGService(dbPool, redisClient)

	ragHandler := handlers.NewRAGHandler(ragService)
	callsHandler := handlers.NewCallsHandler(dbPool, wsHub)
	leadsHandler := handlers.NewLeadsHandler(leadRepo)
	campaignsHandler := handlers.NewCampaignsHandler(leadRepo)
	analyticsHandler := handlers.NewAnalyticsHandler(dbPool)

	superAdminHandler := handlers.NewSuperAdminHandler(dbPool)

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up"})
	})

	api := r.Group("/api/v1")
	{
		api.POST("/rag/search", ragHandler.Search)
		api.POST("/calls/start", callsHandler.StartCall)
		api.POST("/calls/end", callsHandler.EndCall)
		api.POST("/leads/update", leadsHandler.UpdateStatus)
		api.GET("/campaigns/:id/script", campaignsHandler.GetScript)

		// Analytics Endpoint
		api.GET("/analytics/daily", analyticsHandler.GetDailyAnalytics)

		// Super Admin Endpoints
		sa := api.Group("/superadmin")
		{
			sa.GET("/stats", superAdminHandler.GetSystemStats)
			sa.GET("/tenants", superAdminHandler.GetTenants)
			sa.POST("/tenants/credits", superAdminHandler.UpdateTenantCredits)
			sa.GET("/trunks", superAdminHandler.GetTrunks)
			sa.GET("/gateways", superAdminHandler.GetGateways)
			sa.GET("/ai-engines", superAdminHandler.GetAIEngines)
			sa.GET("/audit-logs", superAdminHandler.GetAuditLogs)
		}

		// Real-Time WebSocket Endpoint
		api.GET("/ws/calls", func(c *gin.Context) {
			ws.ServeWS(wsHub, c)
		})
	}

	protected := api.Group("")
	protected.Use(middleware.AuthRequired(authService))
	{
		protected.GET("/me", func(c *gin.Context) {
			userID, _ := c.Get("userID")
			c.JSON(http.StatusOK, gin.H{"user_id": userID})
		})
	}

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	// Graceful Shutdown Channel
	go func() {
		fmt.Printf("Starting Server on port %s...\n", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen error: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited cleanly.")
}
