import { makeAutoObservable } from 'mobx';

class UserStore {
  currentUser = null;
  reciepientUser = null;
  onlineUsers = [];
  allUsers = [];

  constructor() {
    makeAutoObservable(this);
    this.loadCurrentUser();
    this.loadReciepientUser();
  }
  /**
   * Set the current user
   * @param {Object} user - The user object
   */
  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  /**
   * Load the current user from local storage
   */
  loadCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }
    /**
     * Set the reciepient user
     * @param {Object} user - The user object
     */
  setReciepientUser(user) {
    this.reciepientUser = user;
    localStorage.setItem('reciepientUser', JSON.stringify(user));
  }
    /**
     * Load the reciepient user from local storage
     */
  loadReciepientUser() {
    const savedUser = localStorage.getItem('reciepientUser');
    if (savedUser) {
      this.reciepientUser = JSON.parse(savedUser);
    }
  }
    /**
     * Get the current user
     * @returns {Object} The current user object
     */
    get getCurrentUser() {
        return this.currentUser;
    }
    /**
     * Get the reciepient user
     * @returns {Object} The reciepient user object
     */
    get getReciepientUser() {
        return this.reciepientUser;
    }

    /**
     * Set the list of online users
     * @param {Array} users - The list of online users
     */
    setOnlineUsers(users) {
      //console.log("Setting online users", users);
      this.onlineUsers = users;
    }

    setAllUsers(users) {
      this.allUsers = users;
    }

    getAllUsers() {
      return this.allUsers;
    }
    /**
     * Get the list of online users
     * @returns {Array} The list of online users
     */
    get getOnlineUsers() {
        return this.onlineUsers; 
    }
}

export const userStore = new UserStore();
window.userStore = userStore;
