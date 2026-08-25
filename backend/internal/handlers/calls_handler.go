package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ramzan/backend-chatbot/internal/websocket"
)

type CallsHandler struct {
	dbPool *pgxpool.Pool
	wsHub  *websocket.Hub
}

func NewCallsHandler(dbPool *pgxpool.Pool, wsHub *websocket.Hub) *CallsHandler {
	return &CallsHandler{
		dbPool: dbPool,
		wsHub:  wsHub,
	}
}

type StartCallRequest struct {
	LeadID uuid.UUID `json:"lead_id" binding:"required"`
}

type EndCallRequest struct {
	CallID       uuid.UUID `json:"call_id" binding:"required"`
	LeadID       uuid.UUID `json:"lead_id" binding:"required"`
	Status       string    `json:"status" binding:"required"`
	Transcript   string    `json:"transcript"`
	Duration     int       `json:"duration"`
	RecordingURL string    `json:"recording_url"`
}

// POST /api/v1/calls/start
func (h *CallsHandler) StartCall(c *gin.Context) {
	var req StartCallRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	ctx := c.Request.Context()

	query := `
		SELECT l.id, l.campaign_id, c.name, c.script_template, c.voice_prompt
		FROM leads l
		JOIN campaigns c ON l.campaign_id = c.id
		WHERE l.id = $1`

	var leadID, campaignID uuid.UUID
	var campaignName, scriptTemplate, voicePrompt string

	err := h.dbPool.QueryRow(ctx, query, req.LeadID).
		Scan(&leadID, &campaignID, &campaignName, &scriptTemplate, &voicePrompt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lead or Campaign not found: " + err.Error()})
		return
	}

	callQuery := `
		INSERT INTO call_records (lead_id, status)
		VALUES ($1, 'initiated')
		RETURNING id`

	var callID uuid.UUID
	err = h.dbPool.QueryRow(ctx, callQuery, req.LeadID).Scan(&callID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initiate call record: " + err.Error()})
		return
	}

	h.dbPool.Exec(ctx, "UPDATE leads SET status = 'calling', updated_at = NOW() WHERE id = $1", req.LeadID)

	respData := gin.H{
		"call_id":         callID,
		"lead_id":         leadID,
		"campaign_name":   campaignName,
		"script_template": scriptTemplate,
		"voice_prompt":    voicePrompt,
	}

	// Broadcast call_started event to WebSocket subscribers
	h.wsHub.BroadcastEvent("call_started", respData)

	c.JSON(http.StatusOK, respData)
}

// POST /api/v1/calls/end
func (h *CallsHandler) EndCall(c *gin.Context) {
	var req EndCallRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	ctx := c.Request.Context()

	query := `
		UPDATE call_records
		SET status = $1, transcript = $2, duration = $3, recording_url = $4, updated_at = NOW()
		WHERE id = $5`

	cmd, err := h.dbPool.Exec(ctx, query, req.Status, req.Transcript, req.Duration, req.RecordingURL, req.CallID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save call record: " + err.Error()})
		return
	}

	if cmd.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Call record not found"})
		return
	}

	h.dbPool.Exec(ctx, "UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2", req.Status, req.LeadID)

	// Broadcast call_ended event to WebSocket subscribers
	h.wsHub.BroadcastEvent("call_ended", req)

	c.JSON(http.StatusOK, gin.H{"message": "Call finalized successfully"})
}
