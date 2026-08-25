package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SuperAdminHandler struct {
	db *pgxpool.Pool
}

func NewSuperAdminHandler(db *pgxpool.Pool) *SuperAdminHandler {
	return &SuperAdminHandler{db: db}
}

func (h *SuperAdminHandler) GetSystemStats(c *gin.Context) {
	ctx := context.Background()

	var tenantCount, trunkCount, gatewayCount, engineCount, auditCount int
	var totalMRR float64

	_ = h.db.QueryRow(ctx, "SELECT COUNT(*), COALESCE(SUM(mrr), 0) FROM tenants").Scan(&tenantCount, &totalMRR)
	_ = h.db.QueryRow(ctx, "SELECT COUNT(*) FROM sip_trunks").Scan(&trunkCount)
	_ = h.db.QueryRow(ctx, "SELECT COUNT(*) FROM gateways").Scan(&gatewayCount)
	_ = h.db.QueryRow(ctx, "SELECT COUNT(*) FROM ai_engines").Scan(&engineCount)
	_ = h.db.QueryRow(ctx, "SELECT COUNT(*) FROM audit_logs").Scan(&auditCount)

	c.JSON(http.StatusOK, gin.H{
		"total_tenants":  tenantCount,
		"total_mrr":      totalMRR,
		"active_trunks":  trunkCount,
		"gateways_count": gatewayCount,
		"ai_engines":     engineCount,
		"audit_logs":     auditCount,
	})
}

func (h *SuperAdminHandler) GetTenants(c *gin.Context) {
	ctx := context.Background()
	rows, err := h.db.Query(ctx, "SELECT id, tenant_name, status, mrr, COALESCE(credits_balance, 0.00), created_at FROM tenants ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"tenants": []interface{}{}})
		return
	}
	defer rows.Close()

	type TenantRes struct {
		ID             int     `json:"id"`
		TenantName     string  `json:"tenant_name"`
		Status         string  `json:"status"`
		MRR            float64 `json:"mrr"`
		CreditsBalance float64 `json:"credits_balance"`
		CreatedAt      string  `json:"created_at"`
	}

	tenants := make([]TenantRes, 0)
	for rows.Next() {
		var t TenantRes
		var createdAt interface{}
		if err := rows.Scan(&t.ID, &t.TenantName, &t.Status, &t.MRR, &t.CreditsBalance, &createdAt); err == nil {
			tenants = append(tenants, t)
		}
	}

	c.JSON(http.StatusOK, gin.H{"tenants": tenants})
}

func (h *SuperAdminHandler) UpdateTenantCredits(c *gin.Context) {
	ctx := context.Background()
	var req struct {
		TenantID int     `json:"tenant_id" binding:"required"`
		Amount   float64 `json:"amount"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `UPDATE tenants SET credits_balance = $1 WHERE id = $2`
	_, err := h.db.Exec(ctx, query, req.Amount, req.TenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update credits in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "tenant_id": req.TenantID, "credits_balance": req.Amount})
}

func (h *SuperAdminHandler) GetTrunks(c *gin.Context) {
	ctx := context.Background()
	rows, err := h.db.Query(ctx, "SELECT id, carrier_name, active_channels, max_capacity, rate_per_min, status FROM sip_trunks ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"trunks": []interface{}{}})
		return
	}
	defer rows.Close()

	type TrunkRes struct {
		ID             int     `json:"id"`
		CarrierName    string  `json:"carrier_name"`
		ActiveChannels int     `json:"active_channels"`
		MaxCapacity    int     `json:"max_capacity"`
		RatePerMin     float64 `json:"rate_per_min"`
		Status         string  `json:"status"`
	}

	trunks := make([]TrunkRes, 0)
	for rows.Next() {
		var tr TrunkRes
		if err := rows.Scan(&tr.ID, &tr.CarrierName, &tr.ActiveChannels, &tr.MaxCapacity, &tr.RatePerMin, &tr.Status); err == nil {
			trunks = append(trunks, tr)
		}
	}

	c.JSON(http.StatusOK, gin.H{"trunks": trunks})
}

func (h *SuperAdminHandler) GetGateways(c *gin.Context) {
	ctx := context.Background()
	rows, err := h.db.Query(ctx, "SELECT id, gateway_name, gateway_type, host, port, username, status FROM gateways ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"gateways": []interface{}{}})
		return
	}
	defer rows.Close()

	type GatewayRes struct {
		ID          int    `json:"id"`
		GatewayName string `json:"gateway_name"`
		GatewayType string `json:"gateway_type"`
		Host        string `json:"host"`
		Port        int    `json:"port"`
		Username    string `json:"username"`
		Status      string `json:"status"`
	}

	gateways := make([]GatewayRes, 0)
	for rows.Next() {
		var gw GatewayRes
		if err := rows.Scan(&gw.ID, &gw.GatewayName, &gw.GatewayType, &gw.Host, &gw.Port, &gw.Username, &gw.Status); err == nil {
			gateways = append(gateways, gw)
		}
	}

	c.JSON(http.StatusOK, gin.H{"gateways": gateways})
}

func (h *SuperAdminHandler) GetAIEngines(c *gin.Context) {
	ctx := context.Background()
	rows, err := h.db.Query(ctx, "SELECT id, engine_name, engine_type, endpoint_url, total_calls_executed, tokens_processed, avg_latency_ms, monthly_cost, status FROM ai_engines ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"ai_engines": []interface{}{}})
		return
	}
	defer rows.Close()

	type EngineRes struct {
		ID                 int     `json:"id"`
		EngineName         string  `json:"engine_name"`
		EngineType         string  `json:"engine_type"`
		EndpointURL        string  `json:"endpoint_url"`
		TotalCallsExecuted int     `json:"total_calls_executed"`
		TokensProcessed    int64   `json:"tokens_processed"`
		AvgLatencyMS       int     `json:"avg_latency_ms"`
		MonthlyCost        float64 `json:"monthly_cost"`
		Status             string  `json:"status"`
	}

	engines := make([]EngineRes, 0)
	for rows.Next() {
		var eng EngineRes
		if err := rows.Scan(&eng.ID, &eng.EngineName, &eng.EngineType, &eng.EndpointURL, &eng.TotalCallsExecuted, &eng.TokensProcessed, &eng.AvgLatencyMS, &eng.MonthlyCost, &eng.Status); err == nil {
			engines = append(engines, eng)
		}
	}

	c.JSON(http.StatusOK, gin.H{"ai_engines": engines})
}

func (h *SuperAdminHandler) GetAuditLogs(c *gin.Context) {
	ctx := context.Background()
	rows, err := h.db.Query(ctx, "SELECT id, event_type, description, ip_address, created_at FROM audit_logs ORDER BY id DESC LIMIT 100")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"audit_logs": []interface{}{}})
		return
	}
	defer rows.Close()

	type AuditRes struct {
		ID          int    `json:"id"`
		EventType   string `json:"event_type"`
		Description string `json:"description"`
		IPAddress   string `json:"ip_address"`
		CreatedAt   string `json:"created_at"`
	}

	logs := make([]AuditRes, 0)
	for rows.Next() {
		var log AuditRes
		var createdAt interface{}
		if err := rows.Scan(&log.ID, &log.EventType, &log.Description, &log.IPAddress, &createdAt); err == nil {
			logs = append(logs, log)
		}
	}

	c.JSON(http.StatusOK, gin.H{"audit_logs": logs})
}
