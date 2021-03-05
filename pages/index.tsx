import Head from "next/head";
import { Link as ChakraLink, Container, Box, StackDivider, VStack, Heading, Text, Avatar, Flex, HStack, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Tag, Skeleton } from "@chakra-ui/react";
import React, { useMemo } from "react";
import type { PlaylistsResponse, Playlist } from "../lib/PlaylistsResponse";
import useFetch from "../hooks/useFetch";
import Link from 'next/link'
import { MeResponse } from "../lib/MeResponse";
import useErrorGuardedFetch from "../hooks/useErrorsGuardedFetch";


// function PlaylistCard({ name, description, images, tracks, ...rest }: Playlist) {
//   return (
//     <Box p={5} shadow="md" borderWidth="1px">
//       <HStack>
//         <Avatar name={name} src={images[0]?.url} />
//         <Heading fontSize="xl">{name}</Heading>
//       </HStack>
//       <Text mt={4}>{description}</Text>
//       <StatGroup>
//         <Stat>
//           <StatLabel>Tracks</StatLabel>
//           <StatNumber>{tracks.total}</StatNumber>
//           <StatHelpText>
//             No. tracks
//         </StatHelpText>
//         </Stat>
//       </StatGroup>
//       {/* {JSON.stringify(rest)} */}
//     </Box>
//   )
// }

function CurentUserCard({ }) {

  const { status, data, error } = useFetch<MeResponse>("/api/me");

  const mock = useMemo(() => (
    <Box p="10" shadow="sm" borderWidth="1px">
      <VStack width="100%">
        <Avatar w="12" h="12" />
        <Heading fontSize="xl"><Skeleton w="100px" h="23px" /></Heading>
      </VStack>
    </Box>
  ), []);

  if (status !== "fetched") {
    return mock;
  }

  return (
    <Box p="10" shadow="sm" borderWidth="1px">
      <VStack width="100%">
        <Avatar w="12" h="12" name={data.display_name} src={data.images[0]?.url} />
        <Heading fontSize="xl">{data.display_name}</Heading>
      </VStack>
    </Box>
  )
}

function PlaylistCard({ name, description, images, tracks, owner, id, ...rest }: Playlist) {
  return (
    <Link href={`/playlist/${encodeURIComponent(id)}`}>
      <Box position="relative" cursor="pointer" p={2} shadow="md" borderWidth="1px">
        <HStack>
          <Avatar w="12" h="12" name={name} src={images[0]?.url} />
          <VStack align="flex-start" width="100%">
            <Heading fontSize="xl">{name}</Heading>
            <Tag alignSelf="flex-end">{owner.display_name}</Tag>
          </VStack>
        </HStack>
        <Box backgroundImage={`url(${images[0]?.url})`} position="absolute" top="0" left="0" right="0" bottom="0" zIndex="-1" pointerEvents="none" opacity="0.2" filter="blur(2px)" />
      </Box>
    </Link>
  )
}


function PlaylistCardMock() {
  return (
    <Box position="relative" p={2} shadow="md" borderWidth="1px">
      <HStack>
        <Avatar w="12" h="12" />
        <VStack align="flex-start" width="100%">
          <Heading fontSize="xl"><Skeleton w={100 + 50 * Math.random()} h="24px" /></Heading>
          <Tag alignSelf="flex-end"><Skeleton w={10 + 40 * Math.random()} h="10px" /></Tag>
        </VStack>
      </HStack>
    </Box>
  )
}

export default function Home() {
  const { status, data, error } = useErrorGuardedFetch<PlaylistsResponse>("/api/playlists?limit=50");

  const mock = useMemo(() => Array(10).fill(null).map((_, key) => (
    <PlaylistCardMock key={key} />
  )), []);

  return (
    <Container p="10" w="100%" maxW="md">
      <HStack>
        <VStack
          w="100%"
          align="stretch"
        >
          <CurentUserCard />
          {status !== "fetched" ? mock : (
            data.items.map(item => (
              <PlaylistCard key={item.id} {...item} />
            ))
          )}
        </VStack>
      </HStack>
    </Container>
  );
}


// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }