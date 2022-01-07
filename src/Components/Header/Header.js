import React from 'react';
import {
    HeaderContainer,
    HeaderWrapper,
    HeaderTitle,
    HeaderSubtitle,
    GithubLogin,
    PortofolioLink
} from './';
import { config } from "../../config";

export const Header = () => {
    return (
        <HeaderContainer>
            <GithubLogin isAbsolute={true} />
            <PortofolioLink to="https://www.rasguymedia.com" >Portofolio</PortofolioLink>
            <HeaderWrapper>
                <HeaderTitle>{config.title}</HeaderTitle>
                <HeaderSubtitle>{config.subtitle}</HeaderSubtitle>
            </HeaderWrapper>
        </HeaderContainer>
    )
}
