import styled from "styled-components";

export const PortofolioLink = styled.a.attrs( props => ({
    href: props.to,
}))`
    outline: none;
    // display: block;
    text-decoration: none;
    border: 1px solid;
    font-size: 22px;
    font-family: "Shadows Into Light", serif;
    border-radius: 5px;
    padding: 0px 30px 0 30px;
    cursor: pointer;
    position: absolute;
    margin-top: 0px;
    top: 10px;
    left: 10px;
    background-color: ${ props => props.theme.body };
    color: ${ props => props.theme.text };

    :hover {
    background-color: ${ props => props.theme.mode === 'light' ? '#373737' : '#6B8096' };
    color: white;
    }
`;