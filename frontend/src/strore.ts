export const UserStore = {
  users: [] as Array<{ id: number; email: string; name: string , password:string}>,
  addUser(user: { id: number; email: string; name: string ,password:string}) {
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  },
  getUsers() {
    
    return this.users;
  },
  currentUser: null as { id: number; email: string; name: string , password:string} | null,
  setCurrentUser(user: { id: number; email: string; name: string , password:string} | null) {
    this.currentUser = user;
  }
};
