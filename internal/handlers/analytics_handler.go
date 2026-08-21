package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AnalyticsHandler struct {
	dbPool *pgxpool.Pool
}

func NewAnalyticsHandler(dbPool *pgxpool.Pool) *AnalyticsHandler {
	return &AnalyticsHandler{dbPool: dbPool}
}

type DailyCallMetric struct {
	Date           string  `json:"date"`
	TotalCalls     int     `json:"total_calls"`
	Completed      int     `json:"completed_calls"`
	Failed         int     `json:"failed_calls"`
	AvgDurationSec float64 `json:"avg_duration_seconds"`
}

type DailyLeadMetric struct {
	Date            string `json:"date"`
	TotalLeads      int    `json:"total_leads"`
	InterestedLeads int    `json:"interested_leads"`
}

type AnalyticsResponse struct {
	CallAnalytics []DailyCallMetric `json:"call_analytics"`
	LeadAnalytics []DailyLeadMetric `json:"lead_analytics"`
}

// GET /api/v1/analytics/daily
func (h *AnalyticsHandler) GetDailyAnalytics(c *gin.Context) {
	ctx := c.Request.Context()
	campaignID := c.Query("campaign_id")

	// 1. Aggregation Query for Daily Calls
	callQuery := `
		SELECT 
			TO_CHAR(DATE(cr.created_at), 'YYYY-MM-DD') AS date,
			COUNT(*) AS total_calls,
			COUNT(*) FILTER (WHERE cr.status = 'completed') AS completed_calls,
			COUNT(*) FILTER (WHERE cr.status = 'failed') AS failed_calls,
			COALESCE(AVG(cr.duration), 0) AS avg_duration
		FROM call_records cr
		LEFT JOIN leads l ON cr.lead_id = l.id
		WHERE ($1 = '' OR l.campaign_id::text = $1)
		GROUP BY DATE(cr.created_at)
		ORDER BY DATE(cr.created_at) DESC
		LIMIT 30`

	rows, err := h.dbPool.Query(ctx, callQuery, campaignID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch call analytics: " + err.Error()})
		return
	}
	defer rows.Close()

	var callMetrics []DailyCallMetric
	for rows.Next() {
		var m DailyCallMetric
		if err := rows.Scan(&m.Date, &m.TotalCalls, &m.Completed, &m.Failed, &m.AvgDurationSec); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan error: " + err.Error()})
			return
		}
		callMetrics = append(callMetrics, m)
	}

	if callMetrics == nil {
		callMetrics = []DailyCallMetric{}
	}

	// 2. Aggregation Query for Daily Leads
	leadQuery := `
		SELECT 
			TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date,
			COUNT(*) AS total_leads,
			COUNT(*) FILTER (WHERE status = 'interested') AS interested_leads
		FROM leads
		WHERE ($1 = '' OR campaign_id::text = $1)
		GROUP BY DATE(created_at)
		ORDER BY DATE(created_at) DESC
		LIMIT 30`

	leadRows, err := h.dbPool.Query(ctx, leadQuery, campaignID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lead analytics: " + err.Error()})
		return
	}
	defer leadRows.Close()

	var leadMetrics []DailyLeadMetric
	for leadRows.Next() {
		var lm DailyLeadMetric
		if err := leadRows.Scan(&lm.Date, &lm.TotalLeads, &lm.InterestedLeads); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lead row scan error: " + err.Error()})
			return
		}
		leadMetrics = append(leadMetrics, lm)
	}

	if leadMetrics == nil {
		leadMetrics = []DailyLeadMetric{}
	}

	c.JSON(http.StatusOK, AnalyticsResponse{
		CallAnalytics: callMetrics,
		LeadAnalytics: leadMetrics,
	})
}
