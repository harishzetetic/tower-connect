client: 
FrontEnd: React/Next.js
Authorization: JWT Web Token
State Management: Redux ToolKit
API Calls: Axios
Frontend UI: Material UI
Forms: React Forms
Validation: Yup
Scrolling Library: React Virtualized
Animation: React Spring

server:
library:Express.js
Env Variables: .env
web socket.io: backend send notification to client when updates


mongoDB Atlas Login account: towerconnect8@gmail.com
Role: 'OWNER' 'TENANT'
Jaihanuman2.0

Backlog:
1. Keep encrypted password in database
4. we are showing loading screen before render anything, but if api fails, we need a alternative way to redirect to admin page or somewhere
5. if we are refreshing ownersignup page its redirecting to login page
6.make sure each api search the data from db along with societyId
7.replace all axios calls with react query
8. Right now user online status only show when he comes to messaging page but we need if user logged in with app, he should online
9. now we want to remove user from online state if not loggedin or loggedout by self.
10. use localstorage rather then session storage
11. Bug. when seach user on messaging and select it for a new chat, ui not showing selected chat immediately we habe to refreshing
12. Bug. When we successful signup. i am click on login but it not redirect me on login
13. apply web accesability
14. responsive understand grid
15. apply the indexing concept for mongoDB calls, otherwise when collections grow queries will take too much time to process
16. add a functionality where your share their listing in community


Next Tasks
1. Code refinement
2. Home Page responsive
3. Profile Edit Functionality (occupation, )