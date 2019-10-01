import React from 'react';

import {Admin,Resource,ListGuesser} from 'react-admin';
import dataProvider from './wsProvider';

const App=()=>(
<Admin dataProvider={dataProvider} >
<Resource name="users" list={ListGuesser} />
</Admin>
);  
export default App;
