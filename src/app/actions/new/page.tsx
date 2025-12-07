import ActionFormPage from '../[id]/edit/page';

export default function NewActionPage() {
  return <ActionFormPage params={Promise.resolve({ id: 'new' })} />;
}
