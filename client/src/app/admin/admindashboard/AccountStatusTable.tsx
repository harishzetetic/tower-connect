import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {  deleteOwner, fetchPendingAccounts } from '@/api/adminApis';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IOwnerData } from '@/Types';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { BACKEND_URL } from '@/constants';
import LaunchIcon from '@mui/icons-material/Launch';
import VerifiedIcon from '@mui/icons-material/Verified';
import DangerousIcon from '@mui/icons-material/Dangerous';

import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'



interface IAccountStatusTable{}

export default function AccountStatusTable(props: IAccountStatusTable) {
const router = useRouter()
const pendingAccounts = useQuery({
  queryKey: ['pendingAccounts'],
  queryFn: fetchPendingAccounts
})

const deleteAccountMutation = useMutation({
  mutationFn: (id:string) => deleteOwner(id),
  onSuccess: (data) => {
    if(!data?.data.loginStatus){
      confirm('You are logging out due to invalid token')
      router.push('/admin/superadmin')
    } else {
      useQueryClient().invalidateQueries({queryKey: ["pendingAccounts"]})
    }
  }
});
const approveAccountMutation = useMutation({
  mutationFn: (id:string) => deleteOwner(id),
  onSuccess: () => {
    useQueryClient().invalidateQueries({queryKey: ["pendingAccounts"]})
  },
});
const rejectAccountMutation = useMutation({
  mutationFn: (id:string) => deleteOwner(id),
  onSuccess: () => {
    useQueryClient().invalidateQueries({queryKey: ["pendingAccounts"]})
  }
});
const deleteAccount = (row) => {
  if(confirm('This action will delete this record premanently. Are you still sure to go ahead?')){
    deleteAccountMutation.mutate(row.id)
  }
}

const rows = pendingAccounts && pendingAccounts?.data?.data.map(item => {
  return {
    id: item._id,
    fullName: `${item.firstName} ${item.lastName}`,
    society: item.society,
    towerFlat: `${item.towerNumber}/${item.flatNumber}`,
    mobile: item.phone,
    email: item.email,
    proofDoc: item.proofDocumentURL,
  }
}) || [];

if(pendingAccounts.isLoading){
  return <>Loading Data...</>
}
if(pendingAccounts.isError){
 return <>Error Occurred...</>
}

  return (
    <React.Fragment>
      <Title>Recent Accounts</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Society</TableCell>
            <TableCell>Tower/Flat</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Proof Document</TableCell>
            <TableCell>Actions</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{row.society}</TableCell>
              <TableCell>{row.towerFlat}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
              <Tooltip title="View Proof Document">
                <Button size="small" variant="text" href={`${BACKEND_URL}/${row.proofDoc}`}><LaunchIcon/></Button>
              </Tooltip>
                
                </TableCell>
              <TableCell><ButtonGroup variant="text" size="small" aria-label="small button group">
                  <Tooltip title="Approve Account"><Button color="success" key="one"><VerifiedIcon/></Button></Tooltip>
                  <Tooltip title="Reject Account"><Button color="error" key="two"><DangerousIcon/></Button></Tooltip>
                  <Tooltip title="Delete Record"><Button color="error" key="two" onClick={() => deleteAccount(row)}><DeleteIcon/></Button></Tooltip>
      </ButtonGroup></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}