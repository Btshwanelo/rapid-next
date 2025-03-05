import { RootState } from '@/store';
import { useSelector } from 'react-redux';

function useProject() {
  const projectDetails = useSelector((state: RootState) => state.project);

  return projectDetails.currentProject;
}

export default useProject;
