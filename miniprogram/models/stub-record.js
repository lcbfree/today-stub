/**
 * @typedef {"local_only" | "synced" | "sync_failed"} SyncStatus
 */

/**
 * @typedef {"thermal_default" | "night_stub" | "exhibit_ticket"} ThemeId
 */

/**
 * @typedef {"user" | "fallback_phrase"} SelfSentenceSource
 */

/**
 * @typedef {Object} LifeModule
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} StubRecord
 * @property {string} id
 * @property {number} version
 * @property {string} date
 * @property {string} statusId
 * @property {string} statusLabel
 * @property {number} emotionBalance
 * @property {number} energy
 * @property {string} selfSentence
 * @property {SelfSentenceSource} selfSentenceSource
 * @property {string} proof
 * @property {string} optionalNote
 * @property {LifeModule[]} lifeModules
 * @property {string} openingPhraseId
 * @property {string} statusPhraseId
 * @property {string} verdictId
 * @property {string} verdict
 * @property {string} stampId
 * @property {string} objectId
 * @property {ThemeId} themeId
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {SyncStatus} syncStatus
 */

/**
 * @typedef {Object} DraftState
 * @property {string} date
 * @property {string} statusId
 * @property {number} emotionBalance
 * @property {number} energy
 * @property {string} selfSentence
 * @property {string} proof
 * @property {string} optionalNote
 * @property {LifeModule[]} lifeModules
 * @property {string} openingPhraseId
 * @property {string} statusPhraseId
 * @property {string} verdictId
 * @property {string} themeId
 */

module.exports = {};
