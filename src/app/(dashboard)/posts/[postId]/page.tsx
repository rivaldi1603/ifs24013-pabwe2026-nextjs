import React from 'react';
import DetailPage from '../../../../features/posts/pages/DetailPage';

type Params = Promise<{ postId: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const postId = parseInt(params.postId, 10);
  
  return <DetailPage postId={postId} />;
}
