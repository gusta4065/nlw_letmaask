import { useHistory, useParams } from 'react-router-dom';
// imagens
import  logoImg  from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
//
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
 // const {user} = useAuth();
  const history = useHistory(); 
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  
  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt : new Date(),
    });

    history.push('/');
  }


  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswerd(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }
  
  async function handleHighligthQuestion(questionId : string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    });
    
  }

  return (
    <div id="page-room">
      <header>
        <div className = "content">
          <img src={logoImg} alt="Letmeask" />
          <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main /*className="content"*/>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>
        
        <div className= "question-list">
            {questions.map(question =>{
              return (
                <Question
                    key={question.id}
                    content = {question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighLighted={question.isHighLighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button 
                        type="button"
                        onClick={()=> handleCheckQuestionAsAnswerd(question.id)}
                      >
                          <img src={checkImg} alt="Marcar Pergunta como respondida " />
                      </button>
                      <button 
                        type="button"
                        onClick={()=> handleHighligthQuestion(question.id)}
                      >
                          <img src={answerImg} alt="Destacar Pergunta" />
                      </button>
                    </>
                  )}
                  <button 
                    type="button"
                    onClick={()=> handleDeleteQuestion(question.id)}
                  >
                      <img src={deleteImg} alt="Remover Pergunta" />
                  </button>
                </Question>
              );
            })}
        </div>

      </main>
    </div>
  );
}

