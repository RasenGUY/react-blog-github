import React from 'react';
import {
    HeaderContainer,
    HeaderWrapper,
    HeaderTitle,
    HeaderSubtitle,
    GithubLogin
} from './';
import { config } from "../../config";
import { BackButton } from "../Post";

export const Header = () => {
    return (
        <HeaderContainer>
            <GithubLogin isAbsolute={true} />
            <BackButton>Portofolio</BackButton>
            <HeaderWrapper>
                <HeaderTitle>{config.title}</HeaderTitle>
                <HeaderSubtitle>{config.subtitle}</HeaderSubtitle>
            </HeaderWrapper>
        </HeaderContainer>
    )
}
