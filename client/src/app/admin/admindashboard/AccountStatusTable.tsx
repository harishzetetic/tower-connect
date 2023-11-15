import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {  approveOwnerAccount, deleteOwner, fetchPendingAccounts, rejectOwnerAccount } from '@/api/adminApis';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IOwnerData, ISociety } from '@/Types';
import { Button, ButtonGroup, Card, CardActions, CardContent, Drawer, Tooltip, Typography } from '@mui/material';
import { BACKEND_URL } from '@/constants';
import LaunchIcon from '@mui/icons-material/Launch';
import VerifiedIcon from '@mui/icons-material/Verified';
import DangerousIcon from '@mui/icons-material/Dangerous';

import DeleteIcon from '@mui/icons-material/Delete';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import _ from 'lodash'


interface IAccountStatusTable{}
interface IUserInfo{
    id: string;
    fullName: string;
    society: ISociety;
    towerFlat: string;
    mobile: string;
    email: string;
    proofDoc: string;
}
export default function AccountStatusTable(props: IAccountStatusTable) {
const router = useRouter();
const [isUserInfoDrawerOpen, setIsUserInfoDrawerOpen] = React.useState<boolean>(false);
const [userInfoForDrawer, setUserInfoForDrawer] = React.useState<IUserInfo | null>(null);



const logoutOrInvalidateQueries = (loginStatus: boolean) => {
  if(loginStatus === false){
    alert('You are logging out due to invalid token')
    router.push('/admin/superadmin')
  } else {
    useQueryClient().invalidateQueries({queryKey: ["pendingAccounts"]})
  }
}

const pendingAccounts = useQuery({
  queryKey: ['pendingAccounts'],
  queryFn: fetchPendingAccounts,
})

React.useEffect(()=>{
  const loginStatus = pendingAccounts?.data?.data.loginStatus;
  console.log(loginStatus)
  if(loginStatus === false){
    alert('You are logging out due to invalid token')
    router.push('/admin/superadmin')
  }
},[pendingAccounts])

const deleteAccountMutation = useMutation({
  mutationFn: (id:string) => deleteOwner(id),
  onSuccess: (data) => {
   logoutOrInvalidateQueries(!data?.data.loginStatus);
  }
});
const approveAccountMutation = useMutation({
  mutationFn: (id:string) => approveOwnerAccount(id),
  onSuccess: (data) => {
    logoutOrInvalidateQueries(!data?.data.loginStatus);
  },
});
const rejectAccountMutation = useMutation({
  mutationFn: (data: {id:string; rejectionMessage:string}) => rejectOwnerAccount(data),
  onSuccess: (data) => {
    logoutOrInvalidateQueries(!data?.data.loginStatus);
  }
});

const deleteAccountHandler = (row) => {
  if(confirm('This action will delete this record premanently. Are you still sure to go ahead?')){
    deleteAccountMutation.mutate(row.id)
  }
}
const rejectAccountHandler = (row) => {
  const rejectionMessage = prompt('Rejection reason', '')
  if(rejectionMessage){
    rejectAccountMutation.mutate({id: row.id, rejectionMessage})
  } 
  
}
const approveAccountHandler = (row) => {
  if(confirm('Are you sure want to approve this account. Have you verified the details with uploaded proof document?')){
    approveAccountMutation.mutate(row.id)
  } 
}

const rows:Array<IUserInfo> =  pendingAccounts && _.isArray(pendingAccounts?.data?.data) && pendingAccounts?.data?.data?.map(item => {
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
              <TableCell><Link onClick={()=>{
                setIsUserInfoDrawerOpen(true);
                setUserInfoForDrawer(row)
              }}>{row.fullName}</Link></TableCell>
              <TableCell>
                {`${row.society.builderName} ${row.society.societyName} ${row.society.city} ${row.society.state} ${row.society.country} ${row.society.pin}`}
              </TableCell>
              <TableCell>{row.towerFlat}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
              <Tooltip title="View Proof Document">
                <Button size="small" variant="text" href={`${BACKEND_URL}/${row.proofDoc}`} target='_blank'><LaunchIcon/></Button>
              </Tooltip>
                
                </TableCell>
              <TableCell><ButtonGroup variant="text" size="small" aria-label="small button group">
                  <Tooltip title="Approve Account"><Button color="success" key="one" onClick={() => approveAccountHandler(row)}><VerifiedIcon/></Button></Tooltip>
                  <Tooltip title="Reject Account"><Button color="error" key="two" onClick={() => rejectAccountHandler(row)}><DangerousIcon/></Button></Tooltip>
                  <Tooltip title="Delete Record"><Button color="error" key="two" onClick={() => deleteAccountHandler(row)}><DeleteIcon/></Button></Tooltip>
        </ButtonGroup></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {userInfoForDrawer && <UserInfoDrawer open={isUserInfoDrawerOpen} userInfo={userInfoForDrawer} setIsUserInfoDrawerOpen={setIsUserInfoDrawerOpen}/>}
    </React.Fragment>
  );
}

interface IUserInfoDrawer{
  open:boolean;
  userInfo: IUserInfo;
  setIsUserInfoDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfoDrawer = (props:IUserInfoDrawer) => {

  return <Drawer
  anchor={'right'}
  open={props.open}
  onClose={()=>{props.setIsUserInfoDrawerOpen(!props.open)}}
  sx={{zIndex: '9999'}}
>
   <Card variant="outlined">
   <CardContent>
<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
  Pending
</Typography>
<Typography variant="h5" component="div">
  {props.userInfo.fullName}
</Typography>
<Typography sx={{ mb: 1.5 }} color="text.secondary">
  {props.userInfo.towerFlat}, {props.userInfo.society.builderName} {props.userInfo.society.societyName} {props.userInfo.society.city} {props.userInfo.society.state} {props.userInfo.society.country}
</Typography>
<Typography variant="body2">
  {props.userInfo.mobile}
<br />
  {props.userInfo.email}
</Typography>
</CardContent>
<CardActions>
<Button size="small" variant="text" href={`${BACKEND_URL}/${props.userInfo.proofDoc}`} target='_blank'>Open Proof Document</Button>
</CardActions></Card>
</Drawer>
}