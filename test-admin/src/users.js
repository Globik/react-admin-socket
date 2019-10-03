import React from 'react';
import {List, Datagrid, TextField, ImageField} from 'react-admin';

export const UserList = props => (
<List {...props}>
<Datagrid rowClick="edit">
<TextField source="id"/>
<TextField source="email" />
<TextField source="first_name" />
<TextField source="last_name" />
<ImageField source="avatar"/>
</Datagrid>
</List>
);
