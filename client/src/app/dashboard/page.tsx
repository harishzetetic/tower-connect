"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Autocomplete, Button, ButtonGroup, Container, Grid, SpeedDial, TextField, Typography } from "@mui/material";
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
import { Categories, QUERY_KEYS } from '@/constants';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
const Dashboard = HOC(() => {
    const TOTAL_LIMIT = 12;
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = React.useState<boolean>(false)
    const [filterCategory, setFilterCategory] = React.useState<string>('')
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const fetchListings = async () => {
        try {
            const apiResponse = await fetchAllListings(loggedInUser?.societyId, filterCategory, currentPage, TOTAL_LIMIT);
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
        queryKey: [QUERY_KEYS.FETCH_ALL_LISTINGS],
    })

    React.useEffect(()=>{
        refetchListings()
    }, [currentPage])

    const isLastPage=()=>{
        if(currentPage > 1){
            if(listings.length === 0 || listings.length < TOTAL_LIMIT){
                return true
            }
        }
        return false
    }
    return (<>
        <Container sx={{ ml: 0, mr: 0, mb: 2, maxWidth: 'none !important', borderLeft: '8px solid #1976d2' }}>
            <AdvanceSearch isOpen={isAdvanceSearchOpen} filterCategory={filterCategory} setFilterCategory={setFilterCategory} refetchListings={refetchListings}/>
        </Container>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {listings && listings.length ? (listings as IBuySell[]).map(item => (<BuySellInfoCard key={item._id} data={item} />)) :
                <>

                    <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                        <Box>
                            {/*<Image src={notfound} alt={"owner-logo"} width={300} />*/}
                            <Div> <Typography variant="h1" gutterBottom>{'No Listings'}</Typography></Div>
                        </Box>
                    </Box>
                </>
            }
            {(listings?.length || currentPage > 1) && <Box sx={{width: '100%', pt: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ButtonGroup size="large" aria-label="large button group">
                <Button disabled={currentPage === 1} onClick={()=>{
                    setCurrentPage(currentPage - 1)
                }}><ArrowBackIcon /> Previous Records</Button>
                <Button disabled={isLastPage()}onClick={()=> {
                    setCurrentPage(currentPage + 1)
                }}>Next Records <ArrowForwardIcon /></Button>
                </ButtonGroup>
            </Box> 
            
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
             
                
            </Box>
        </Box>
    } else {
        return <></>
    }

}