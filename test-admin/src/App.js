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
