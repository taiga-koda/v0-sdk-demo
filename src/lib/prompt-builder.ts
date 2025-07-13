type UIFramework = 'mui' | 'tailwind' | 'chakra' | 'ant-design' | 'react-bootstrap' | 'headless';

interface FrameworkConfig {
  name: string;
  imports: string;
  restrictions: string[];
  examples: string;
  systemMessage: string;
}

const FRAMEWORK_CONFIGS: Record<UIFramework, FrameworkConfig> = {
  mui: {
    name: 'Material-UI (MUI)',
    imports: 'import { Box, Typography, Button, TextField, Paper } from \'@mui/material\';',
    restrictions: [
      'Use only @mui/material components',
      'Follow Material Design principles',
      'Use MUI\'s sx prop for styling',
      'Use MUI\'s theme system for colors and spacing',
      'No Tailwind CSS, no plain HTML elements for styling'
    ],
    examples: 'Example imports:\nimport { Box, Typography, Button, TextField, Paper } from \'@mui/material\';',
    systemMessage: 'You are a React developer who ONLY uses Material-UI (MUI) components. You must never use any other UI library, Tailwind CSS, or plain HTML styling. Always import components from @mui/material and use the sx prop for styling. Follow Material Design principles strictly.'
  },
  
  tailwind: {
    name: 'Tailwind CSS',
    imports: 'Use standard HTML elements with Tailwind classes',
    restrictions: [
      'Use only Tailwind CSS classes for styling',
      'Use semantic HTML elements (div, button, input, etc.)',
      'Follow Tailwind\'s utility-first approach',
      'Use Tailwind\'s responsive design classes',
      'No other CSS frameworks or inline styles'
    ],
    examples: 'Example usage:\n<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">',
    systemMessage: 'You are a React developer who ONLY uses Tailwind CSS for styling. Use semantic HTML elements with Tailwind utility classes. Never use other CSS frameworks, inline styles, or CSS-in-JS. Follow Tailwind\'s utility-first methodology.'
  },
  
  chakra: {
    name: 'Chakra UI',
    imports: 'import { Box, Text, Button, Input, Stack } from \'@chakra-ui/react\';',
    restrictions: [
      'Use only @chakra-ui/react components',
      'Follow Chakra UI\'s design system',
      'Use Chakra\'s built-in props for styling',
      'Use Chakra\'s responsive design system',
      'No other UI libraries or custom CSS'
    ],
    examples: 'Example imports:\nimport { Box, Text, Button, Input, Stack } from \'@chakra-ui/react\';',
    systemMessage: 'You are a React developer who ONLY uses Chakra UI components. Import components from @chakra-ui/react and use Chakra\'s built-in styling props. Never use other UI libraries, CSS frameworks, or custom styling.'
  },
  
  'ant-design': {
    name: 'Ant Design',
    imports: 'import { Button, Input, Card, Typography, Space } from \'antd\';',
    restrictions: [
      'Use only antd components',
      'Follow Ant Design\'s design language',
      'Use Ant Design\'s built-in styling system',
      'Use Ant Design\'s grid and layout components',
      'No other UI libraries or custom CSS'
    ],
    examples: 'Example imports:\nimport { Button, Input, Card, Typography, Space } from \'antd\';',
    systemMessage: 'You are a React developer who ONLY uses Ant Design (antd) components. Import components from antd and follow Ant Design\'s design principles. Never use other UI libraries or custom styling.'
  },
  
  'react-bootstrap': {
    name: 'React Bootstrap',
    imports: 'import { Button, Form, Card, Container, Row, Col } from \'react-bootstrap\';',
    restrictions: [
      'Use only react-bootstrap components',
      'Follow Bootstrap\'s design system',
      'Use Bootstrap\'s grid system for layout',
      'Use Bootstrap\'s utility classes when needed',
      'No other UI libraries or custom CSS'
    ],
    examples: 'Example imports:\nimport { Button, Form, Card, Container, Row, Col } from \'react-bootstrap\';',
    systemMessage: 'You are a React developer who ONLY uses React Bootstrap components. Import components from react-bootstrap and follow Bootstrap\'s design principles. Use Bootstrap\'s grid system for layouts.'
  },
  
  headless: {
    name: 'Headless UI',
    imports: 'import { Dialog, Menu, Switch } from \'@headlessui/react\';',
    restrictions: [
      'Use @headlessui/react for interactive components',
      'Use Tailwind CSS for styling',
      'Combine Headless UI components with custom styling',
      'Focus on accessibility and behavior',
      'Use semantic HTML with Tailwind classes'
    ],
    examples: 'Example imports:\nimport { Dialog, Menu, Switch } from \'@headlessui/react\';\n<div className="bg-white p-4 rounded shadow">',
    systemMessage: 'You are a React developer who uses Headless UI for interactive components and Tailwind CSS for styling. Combine @headlessui/react components with Tailwind classes. Focus on accessibility and semantic HTML.'
  }
};

export function buildEnhancedPrompt(userPrompt: string, framework: UIFramework = 'mui'): string {
  const config = FRAMEWORK_CONFIGS[framework];
  
  return `IMPORTANT: You must use ${config.name} components only. Do not use any other UI library.

Create a React component for: ${userPrompt}

Requirements:
${config.restrictions.map(restriction => `- ${restriction}`).join('\n')}
- Include proper TypeScript types
- Make the component responsive

${config.examples}`;
}

export function getSystemMessage(framework: UIFramework = 'mui'): string {
  return FRAMEWORK_CONFIGS[framework].systemMessage;
}

export function getFrameworkConfig(framework: UIFramework): FrameworkConfig {
  return FRAMEWORK_CONFIGS[framework];
}

export function isValidFramework(framework: string): framework is UIFramework {
  return framework in FRAMEWORK_CONFIGS;
}