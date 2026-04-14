import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { MainTemplate } from '../../templates/MainTemplate';

// 1. Tipamos o que a Home vai receber de presente do App
type HomeProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

export function Home(props: HomeProps) {
  // 2. Desestruturamos para facilitar o uso
  const { state, setState } = props;

  return (
    <MainTemplate>
      <Container>
        {/* Em breve, o CountDown vai precisar desse state... */}
        <CountDown />
      </Container>

      <Container>
        {/* ...e o MainForm também! */}
        <MainForm />
      </Container>
    </MainTemplate>
  );
}