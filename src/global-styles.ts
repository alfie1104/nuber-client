import reset from "styled-reset";
import { createGlobalStyle } from "src/typed-component";

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Maven+Pro&display=swap');
${reset}
*{
    bix-sizing:border-box;
}
body{
    font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
a{
    color:inherit;
    text-decoration:none;
}
input,
button{
    &:focus, 
    &:active{outline:none}
}
`;

export default GlobalStyle;
