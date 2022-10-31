import { Layout, Typography } from 'antd';

export default function FallBack() {
  return (
    <Layout className="h-screen">
      <div className="flex items-center gap-2 ">
        <Typography.Title>
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </Typography.Title>
        <Typography.Text>Please contact page admin</Typography.Text>
      </div>
      <a href="/">Back to homepage</a>
    </Layout>
  );
}
