import { TextField, styled } from "@mui/material";
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

  export const TCButton = styled(Button)`
    background-image: linear-gradient(180deg, rgba(51, 153, 255, 0.2) 0%, rgba(0, 89, 178, 0.8) 100%);
    border-radius: 12px !important;
  `
  export const TCButtonOulined = styled(Button)`
  border-radius: 12px !important;
`
  export const TCTextField = styled(TextField)``

  export const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: 28,
    margin: 'auto',
    paddingTop: '100px'
  }));
