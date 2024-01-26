"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Autocomplete, Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slider, SpeedDial, SpeedDialAction, SpeedDialIcon, Switch, TextField, Typography } from "@mui/material";
import BuySellInfoCard, { LoadingBackDrop } from "@/components/dashboard/buySellInfoCard";
import { IBuySell, IOwnerData } from "@/Types";
import { fetchAllListings } from "@/api/ownerApis";
import { Div } from '@/styled';
import notfound from '../../../../client/src/images/notfound.png';
import Image from "next/image";
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import { Categories } from '@/constants';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ViewDayIcon from '@mui/icons-material/ViewDay';

const Dashboard = HOC(() => {
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = React.useState<boolean>(false)
    const [filterCategory, setFilterCategory] = React.useState<string>('')
    const fetchListings = async () => {
        try {
            const apiResponse = await fetchAllListings(loggedInUser?.societyId, filterCategory);
            if (apiResponse?.status === 200) {
                return apiResponse?.data;
            }
        } catch (e) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting listings from server'))
            return []
        }
    }

    const { data: listings, isLoading, refetch:refetchListings } = useQuery({
        queryFn: () => fetchListings(),
        queryKey: ['fetchAllListings'],
        refetchOnWindowFocus: true // this feature is really cool if true, browser check with the server if there are any latest data
    })
    const label = { inputProps: { 'aria-label': 'Color switch demo' } };
    return (<>
        <Container sx={{ ml: 0, mr: 0, mb: 2, maxWidth: 'none !important', borderLeft: '8px solid #1976d2' }}>
            <AdvanceSearch isOpen={isAdvanceSearchOpen} filterCategory={filterCategory} setFilterCategory={setFilterCategory} refetchListings={refetchListings}/>
        </Container>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {listings && listings.length ? (listings as IBuySell[]).map(item => (<BuySellInfoCard key={item._id} data={item} />)) :
                <>

                    <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                        <Box>
                            <Image src={notfound} alt={"owner-logo"} width={300} />
                            <Div> {'There are no live listing now. Create your first one.'}</Div>
                        </Box>
                    </Box>
                </>
            }
            <LoadingBackDrop isLoading={isLoading} />
            <SpeedDial
                ariaLabel="Filter Result"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={isAdvanceSearchOpen ? <FilterListIcon /> : <FilterListOffIcon />}
                onClick={() => {
                    setIsAdvanceSearchOpen(!isAdvanceSearchOpen)
                }}
            >
            </SpeedDial>

        </Grid>
    </>

    )


})

export default Dashboard

interface IAdvanceSearch {
    isOpen: boolean;
    filterCategory: string;
    setFilterCategory: React.Dispatch<React.SetStateAction<string>>;
    refetchListings: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>
}
const AdvanceSearch = (props: IAdvanceSearch) => {
    const {isOpen, filterCategory, setFilterCategory, refetchListings} = props;
    if (isOpen) {
        return <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, mr: 2, display: 'flex' }}>
                <Box width={'50%'} sx={{ mr: 2 }}>
                    <Autocomplete
                        sx={{ flex: 'auto' }}
                        disablePortal
                        id="filter-category"
                        options={Categories}
                        onChange={(_, value) => { setFilterCategory(value?.value || '') }}
                        renderInput={(params) => <TextField {...params} label="Categories" name={"category"} size='small' />}
                    />
                </Box>
                <Box>
                    <Button variant='contained' color='secondary'  onClick={()=>{
                        setFilterCategory('')
                        refetchListings()
                    }}>Clear Filter</Button> &nbsp; &nbsp;
                </Box>
                <Box>
                    <Button variant='contained' onClick={()=>refetchListings()}>Filter Result</Button>
                </Box>

            </Box>

            <Box>
                {/*
                <Switch
                    checked={true}
                    onChange={() => { }}
                    size='medium'
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                */}
                
            </Box>
        </Box>
    } else {
        return <></>
    }

}