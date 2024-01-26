import './RouteItem.scss'
import { NextLink } from "@/styled";
import { SvgIconTypeMap, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface IRouteItem {
    isActive: boolean;
    text: string;
    redirectURL: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; }
}
const RouteItem = ({isActive, text, redirectURL, icon}: IRouteItem) => {
    const Icon = icon;
    return <ListItem className="RouteItem_wrapper" disablePadding sx={{borderLeft: isActive ? '4px solid white' : ''}}>
    <NextLink href={{ pathname: redirectURL }} style={{minWidth: '100%'}}>
        <ListItemButton>
            <ListItemIcon>
                <Icon sx={{ color: isActive ? 'white' : '#9e9e9e' }} />
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItemButton>
    </NextLink>
    
</ListItem>
}

export default RouteItem