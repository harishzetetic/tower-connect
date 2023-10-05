"use client"
import { Button, Drawer, Typography } from "@mui/material";
import React, { useState } from "react";
import CampaignIcon from '@mui/icons-material/Campaign';
import { AppName } from "../../constants";

const AnnouncementDrawer  = () => {
    const [open, setOpen] = useState<boolean>(false);
    const toggleDrawer = (anchor:any, value:boolean) => {
        setOpen(value)
    }
    return <>
          {(['right'] as const).map((anchor) => (
  <React.Fragment key={anchor}>
        <Button  onClick={() => toggleDrawer(anchor, true)} variant="contained" size="large" sx={{ position: 'fixed', bottom: 16, right: 16 }}><CampaignIcon fontSize={'large'}/></Button>

    <Drawer
      anchor={anchor}
      open={open}
      onClose={()=>toggleDrawer(anchor, false)}
    >
      <Typography variant="h4" component="h2">
  Society's Announcements 
</Typography>;
    </Drawer>
  </React.Fragment>
))}
    </>
}

export default AnnouncementDrawer;