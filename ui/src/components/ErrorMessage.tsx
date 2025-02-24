import React from 'react';
import { Message } from 'semantic-ui-react';

interface ErrorDetail {
  field?: string;
  message: string;
  value?: any;
}

interface ErrorResponse {
  message: string;
  code: string;
  details?: ErrorDetail[];
}

interface Props {
  error: any;
}

const ErrorMessage: React.FC<Props> = ({ error }) => {
  const errorData = error?.data as ErrorResponse;

  if (!errorData) {
    return <Message negative>An unexpected error occurred</Message>;
  }

  return (
    <Message negative>
      <Message.Header>{errorData.message}</Message.Header>
      {errorData.details && (
        <Message.List>
          {errorData.details.map((detail, index) => (
            <Message.Item key={index}>
              {detail.field ? `${detail.field}: ${detail.message}` : detail.message}
            </Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
};

export default ErrorMessage; 