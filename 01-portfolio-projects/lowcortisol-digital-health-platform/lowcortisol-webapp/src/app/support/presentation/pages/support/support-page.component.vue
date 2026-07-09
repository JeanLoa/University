<template>
  <AppLayout>
    <section class="page-header">
      <div>
        <h1 class="page-title">
          {{ t('support.page.title') }}
        </h1>

        <p class="page-subtitle">
          {{ t('support.page.subtitle') }}
        </p>
      </div>

      <button class="btn-primary" type="button" @click="handleCreateTicket">
        {{ t('support.page.createTicket') }}
      </button>
    </section>

    <div v-if="state.message" class="success-state">
      {{ state.message }}
    </div>

    <section class="grid grid-3 support-summary">
      <UiCard :title="t('support.page.tickets')" compact>
        <p class="summary-number">{{ state.summary.totalTickets }}</p>
        <p class="summary-label">{{ t('support.page.registeredTickets') }}</p>
      </UiCard>

      <UiCard :title="t('support.page.agents')" compact>
        <p class="summary-number">{{ state.summary.availableAgents }}</p>
        <p class="summary-label">{{ t('support.page.availableAgents') }}</p>
      </UiCard>

      <UiCard :title="t('support.page.help')" compact>
        <p class="summary-number">{{ state.summary.totalArticles }}</p>
        <p class="summary-label">{{ t('support.page.publishedArticles') }}</p>
      </UiCard>
    </section>

    <section class="grid grid-2">
      <UiCard :title="t('support.page.supportTickets')">
        <div v-if="state.loading" class="empty-state">
          {{ t('support.page.loadingTickets') }}
        </div>

        <div v-else-if="state.error" class="error-state">
          {{ state.error }}
        </div>

        <div v-else-if="state.tickets.length === 0" class="empty-state">
          {{ t('support.page.noTickets') }}
        </div>

        <div v-else class="ticket-list">
          <SupportTicketCard
              v-for="ticket in state.tickets"
              :key="ticket.id"
              :ticket="ticket"
              :active="ticket.id === state.selectedTicketId"
              @click="selectTicket(ticket.id)"
          />
        </div>
      </UiCard>

      <UiCard :title="t('support.page.ticketDetail')">
        <div v-if="selectedTicket" class="ticket-detail">
          <div class="ticket-detail__header">
            <div>
              <h3>{{ selectedTicket.title }}</h3>
              <p>{{ selectedTicket.description }}</p>
            </div>

            <span class="badge badge-primary">
              {{ getStatusLabel(selectedTicket.status) }}
            </span>
          </div>

          <div class="conversation">
            <div
                v-for="message in selectedConversation?.messages ?? []"
                :key="message.id"
                class="message"
            >
              <strong>{{ getSenderTypeLabel(message.senderType) }}</strong>
              <p>{{ message.content }}</p>
            </div>
          </div>

          <form class="message-form" @submit.prevent="handleSendMessage">
            <input
                v-model="messageContent"
                type="text"
                :placeholder="t('support.page.writeMessage')"
            />

            <button class="btn-secondary" type="submit">
              {{ t('support.page.send') }}
            </button>
          </form>

          <div class="ticket-actions">
            <button class="btn-secondary" type="button" @click="resolveTicket(selectedTicket.id)">
              {{ t('support.page.resolve') }}
            </button>

            <button class="btn-secondary" type="button" @click="closeTicket(selectedTicket.id)">
              {{ t('support.page.close') }}
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          {{ t('support.page.selectTicket') }}
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 support-bottom">
      <UiCard :title="t('support.page.helpArticles')">
        <div v-if="state.articles.length === 0" class="empty-state">
          {{ t('support.page.noArticles') }}
        </div>

        <div v-else class="article-list">
          <KnowledgeArticleCard
              v-for="article in state.articles"
              :key="article.id"
              :article="article"
              @open="handleOpenArticle"
          />
        </div>
      </UiCard>

      <UiCard :title="t('support.page.agents')">
        <div v-if="state.agents.length === 0" class="empty-state">
          {{ t('support.page.noAgents') }}
        </div>

        <div v-else class="agent-list">
          <article
              v-for="agent in state.agents"
              :key="agent.id"
              class="agent-item"
          >
            <div>
              <strong>{{ agent.fullName }}</strong>
              <span>{{ agent.specialty }}</span>
            </div>

            <span class="badge" :class="getAgentStatusClass(agent.status)">
              {{ getAgentStatusLabel(agent.status) }}
            </span>
          </article>
        </div>
      </UiCard>
    </section>

    <CreateSupportTicketModal
        :open="ticketModalOpen"
        :initial-ticket="ticketModalInitial"
        @close="ticketModalOpen = false"
        @submit="handleSubmitTicket"
    />

    <KnowledgeArticleDetailModal
        :open="articleModalOpen"
        :article="selectedArticle"
        @close="articleModalOpen = false"
        @create-ticket="handleCreateTicketFromArticle"
    />
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import SupportTicketCard from "../../components/support-ticket-card/support-ticket-card.component.vue";
import KnowledgeArticleCard from "../../components/knowledge-article-card/knowledge-article-card.component.vue";
import CreateSupportTicketModal from "../../components/create-support-ticket-modal/create-support-ticket-modal.component.vue";
import KnowledgeArticleDetailModal from "../../components/knowledge-article-detail-modal/knowledge-article-detail-modal.component.vue";

import { useSupportStore } from "../../../application/store/support.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadSupportPage,
  selectTicket,
  getSelectedTicket,
  getSelectedConversation,
  createTicket,
  resolveTicket,
  closeTicket,
  sendMessage,
} = useSupportStore();

const { t } = useTranslation();

const messageContent = ref("");
const ticketModalOpen = ref(false);
const ticketModalInitial = ref({});
const articleModalOpen = ref(false);
const selectedArticle = ref(null);

const selectedTicket = computed(() => getSelectedTicket());
const selectedConversation = computed(() => getSelectedConversation());

onMounted(async () => {
  await loadSupportPage();
});

async function handleCreateTicket() {
  ticketModalInitial.value = {};
  ticketModalOpen.value = true;
}

async function handleSubmitTicket(ticketRequest) {
  await createTicket(ticketRequest);
  ticketModalOpen.value = false;
}

async function handleSendMessage() {
  if (!messageContent.value.trim()) return;

  await sendMessage(messageContent.value);
  messageContent.value = "";
}

function handleOpenArticle(article) {
  selectedArticle.value = article;
  articleModalOpen.value = true;
}

function handleCreateTicketFromArticle(article) {
  articleModalOpen.value = false;
  ticketModalInitial.value = {
    title: `Ayuda: ${article.title}`,
    description: `Necesito apoyo con este articulo: ${article.title}. ${article.summary}`,
    category: article.category === "alerts" ? "incident" : article.category,
  };
  ticketModalOpen.value = true;
}

function getStatusLabel(status) {
  const keys = {
    open: "support.status.open",
    assigned: "support.status.assigned",
    resolved: "support.status.resolved",
    closed: "support.status.closed",
  };

  return t(keys[status] ?? "support.status.unknown");
}

function getSenderTypeLabel(senderType) {
  const keys = {
    user: "support.sender.user",
    agent: "support.sender.agent",
    system: "support.sender.system",
  };

  return t(keys[senderType] ?? "support.sender.unknown");
}

function getAgentStatusClass(status) {
  const classes = {
    available: "badge-success",
    busy: "badge-warning",
    offline: "badge-danger",
  };

  return classes[status] ?? "badge-primary";
}

function getAgentStatusLabel(status) {
  const keys = {
    available: "support.status.available",
    busy: "support.status.busy",
    offline: "support.status.offline",
  };

  return t(keys[status] ?? "support.status.unknown");
}
</script>

<style scoped>
.support-summary {
  margin-bottom: 20px;
}

.support-bottom {
  margin-top: 20px;
}

.summary-number {
  color: var(--color-text);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
  margin: 0 0 8px;
}

.summary-label {
  color: var(--color-text-muted);
  margin: 0;
}

.empty-state,
.error-state,
.success-state {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 18px;
}

.success-state {
  border-style: solid;
  border-color: #bbf7d0;
  background: #ecfdf5;
  color: var(--color-success);
  font-weight: 900;
  margin-bottom: 20px;
}

.error-state {
  color: var(--color-danger);
  background: #fef2f2;
  border-color: #fecaca;
}

.ticket-list,
.article-list,
.agent-list,
.conversation {
  display: grid;
  gap: 14px;
}

.agent-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.agent-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.agent-item strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
  margin-bottom: 4px;
}

.agent-item span {
  color: var(--color-text-muted);
}

.ticket-detail {
  display: grid;
  gap: 18px;
}

.ticket-detail__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.ticket-detail__header h3 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
  margin: 0 0 6px;
}

.ticket-detail__header p {
  color: var(--color-text-muted);
  margin: 0;
}

.message {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 14px;
}

.message strong {
  color: var(--color-primary);
}

.message p {
  color: var(--color-text-muted);
  margin: 6px 0 0;
}

.message-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.message-form input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  color: var(--color-text);
  padding: 14px 16px;
  outline: none;
}

.ticket-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 700px) {
  .message-form,
  .ticket-detail__header,
  .agent-item {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
