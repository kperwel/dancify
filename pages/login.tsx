import { Container, HStack, VStack, Button, Text, Heading, Icon } from "@chakra-ui/react";
import { default as NextLink } from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SpotifyIcon = (props) => (
    <Icon viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527"></path>
        <path d="M9 15c1.5 -1 4 -1 5 .5"></path>
        <path d="M7 9c2 -1 6 -2 10 .5"></path>
    </Icon>
);

export default function LoginPage() {
    const router = useRouter();
    
    return <Container p="10">
        <VStack spacing="10">
            <Text>
                Hi, looks like we need bunch of data from Your Spotify to be able to display Dancify. Click button below to get details.
            </Text>

            <Button leftIcon={<SpotifyIcon width="5" height="5" color="#1DB954" />} onClick={() => router.replace("/api/login")}>
                Login with Spotify
            </Button>
        </VStack>
    </Container>
}