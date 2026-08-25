package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ramzan/backend-chatbot/internal/repository"
)

type CampaignsHandler struct {
	repo repository.LeadRepository
}

func NewCampaignsHandler(repo repository.LeadRepository) *CampaignsHandler {
	return &CampaignsHandler{repo: repo}
}

// GET /api/v1/campaigns/:id/script
func (h *CampaignsHandler) GetScript(c *gin.Context) {
	idParam := c.Param("id")
	campaignID, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign UUID"})
		return
	}

	campaign, err := h.repo.GetCampaignByID(c.Request.Context(), campaignID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"campaign_id":     campaign.ID,
		"name":            campaign.Name,
		"script_template": campaign.ScriptTemplate,
		"voice_prompt":    campaign.VoicePrompt,
	})
}
