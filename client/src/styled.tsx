import { Badge, Box, TextField, styled } from "@mui/material";
import {Button} from "@mui/material";
import Link from "next/link";

export const NextLink = styled(Link)`
      text-decoration: none;
      color: inherit;
      &:focus, &:hover, &:visited, &:link, &:active {
          text-decoration: none;
      }
`
export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  export const TCButton = styled(Button)``
  export const TCButtonOulined = styled(Button)``
  export const TCTextField = styled(TextField)``

  export const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    padding: theme.spacing(1),
    fontSize: 28,
    margin: 'auto',
    paddingTop: '100px'
  }));

  export const FlexBox = styled(Box)`
    display: flex
  `

  export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  