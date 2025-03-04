'use strict'
/**
 * Chats class
 * Manages chats
 */

const CHATS_DB_KEY = 'chats'

module.exports = class Chats {
  constructor (store) {
    // Ensure singleton
    if (!!Chats.instance) {
      return Chats.instance
    }
    Chats.instance = this

    this._store = store
    this._chats = {}

    // Bindings
    return this
  }

  // Saves chats to the store
  async _saveChats () {
    await this._store.put(CHATS_DB_KEY, this._chats)
    console.log('Saved chats')
  }

  // Loads all saved chats from the store
  async init () {
    try {
      this._chats = await this._store.get(CHATS_DB_KEY)
      console.log('Loaded chats')
      console.log(this._chats)
      return true
    } catch (err) {
      // No self keys exist
      if (err.notFound) return false
      throw err
    }
  }

  // Gets the id of the most recent chat or false if none
  getLatestId () {
    const chats = Object.values(this._chats)
    if (!chats.length) return false
    const mostRecentChat = chats.reduce((prevChat, chat) => {
      // Ensure it has messages
      if (!chat.messages.length) return prevChat
      // Parse most recent message times as Unix timestamp
      let prevChatTime = new Date(prevChat.messages[0].timestamp).getTime()
      let chatTime = new Date(chat.messages[0].timestamp).getTime()
      // Select most recent
      return prevChatTime > chatTime ? prevChat : chat
    })
    return mostRecentChat && mostRecentChat.id
  }

  // Gets the chats
  getChats () {
    return this._chats
  }

  // Checks if a chat exists
  has (id) {
    return !!this._chats[id]
  }

  // Adds a chat
  async add (id, publicKeyArmored, address) {
    this._chats[id] = {
      id,
      publicKeyArmored,
      ...address,
      messages: []
    }
    await this._saveChats()
  }

  // Deletes a chat
  async delete (id) {
    delete this._chats[id]
    await this._saveChats()
    console.log('Deleted chat', id)
  }

  // Adds a message
  addMessage (id, message) {
    this._chats[id].messages.push(message)
    // this._saveChats()
  }

  // Set a chat as online
  setOnline (id) {
    return (this._chats[id].online = true)
  }

  // Set a chat as offline
  setOffline (id) {
    return (this._chats[id].online = false)
  }
}
