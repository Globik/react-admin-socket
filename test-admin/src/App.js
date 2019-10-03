import React from 'react';

import {Admin,Resource} from 'react-admin';
import {UserList} from './users';
import dataProvider from './wsProvider';

const App=()=>(
<Admin dataProvider={dataProvider} >
<Resource name="users" list={UserList} />
</Admin>
);  
export default App;

// for real life the websocket solution is good is the ra-realtime packet and customSaga implementation,
// but I am not so good for the time being with a customSaga property
