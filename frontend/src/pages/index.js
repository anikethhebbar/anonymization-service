import AnonymizationService from '../components/AnonymizationService';
import { ChakraProvider } from '@chakra-ui/react';

export default function Home() {
  return (
    <ChakraProvider>
      <AnonymizationService />
    </ChakraProvider>
  );
}