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
    return (
        <ListItem className="RouteItem_wrapper" disablePadding>
            <NextLink href={{ pathname: redirectURL }} style={{minWidth: '100%'}}>
                <ListItemButton
                    sx={{
                        borderRadius: 2,
                        my: 0.5,
                        background: isActive ? 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)' : 'transparent',
                        color: isActive ? '#fff' : '#b0b8c9',
                        boxShadow: isActive ? '0 2px 8px 0 rgba(33, 150, 243, 0.10)' : 'none',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        '&:hover': {
                            background: 'rgba(33, 150, 243, 0.10)',
                            color: '#fff',
                        },
                        minHeight: 48,
                        px: 2
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Icon sx={{ color: isActive ? '#fff' : '#9e9e9e', fontSize: 26, transition: 'color 0.3s' }} />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: 16 }} />
                </ListItemButton>
            </NextLink>
        </ListItem>
    );
}

export default RouteItem