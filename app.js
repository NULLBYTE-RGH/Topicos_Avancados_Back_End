import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [feedback, setFeedback] = useState({ ID: '', classificacao: '', comentario: '', informacoes: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [backendURL, setBackendURL] = useState('');
  const [apiKey, setApiKey] = useState('YKA4hOolXM7tlqLo1cBow3kEPXJQVxWP287RK6YA');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevFeedback) => ({ ...prevFeedback, [name]: value }));
  };

  const handleURLChange = (event) => {
    setBackendURL(event.target.value);
  };

  const config = {
    headers: {
      'x-api-key': apiKey
    }
  };

const obterFeedbacks = async () => {
  try {
    const response = await axios.get(`${backendURL}/feedback`, config);

    if (response.data && response.data.body) {
      const dataFromBody = JSON.parse(response.data.body);

      if (Array.isArray(dataFromBody)) {
        const feedbacksFormatted = dataFromBody.map(feedback => ({
          ID: feedback.ID,
          classificacao: feedback.Classificacao,
          comentario: feedback.Comentario,
          informacoes: feedback.Informacoes
        }));

        setFeedbacks(feedbacksFormatted);
      } else {
        console.error("Dados de feedback inválidos: não é um array", dataFromBody);
      }
    } else {
      console.error("Resposta inválida da API", response.data);
    }
  } catch (error) {
    console.error("Erro ao obter feedbacks", error);
  }
};

const cadastrarFeedback = async () => {
  try {
    const feedbackData = {
      ID: feedback.ID,
      classificacao: feedback.classificacao,
      comentario: feedback.comentario,
      informacoes: feedback.informacoes
    };

    const response = await axios.post(`${backendURL}/feedback`, feedbackData, config);
    if (response.status === 200 || response.status === 201) {
      const novoFeedback = {
        ID: feedback.ID,
        classificacao: feedback.classificacao,
        comentario: feedback.comentario,
        informacoes: feedback.informacoes
      };

      setFeedbacks([...feedbacks, novoFeedback]);
      setFeedback({ ID: '', classificacao: '', comentario: '', informacoes: '' });
    } else {
      console.error("Erro ao cadastrar o feedback", response.data);
    }
  } catch (error) {
    console.error("Erro ao conectar com o back-end", error);
  }
};

  return (
    <div className="App">
      <form>
        <input
          name="ID"
          placeholder="ID"
          value={feedback.ID}
          onChange={handleInputChange}
        />
        <input
          name="classificacao"
          placeholder="Classificação"
          value={feedback.classificacao}
          onChange={handleInputChange}
        />
        <input
          name="comentario"
          placeholder="Comentário"
          value={feedback.comentario}
          onChange={handleInputChange}
        />
        <input
          name="informacoes"
          placeholder="Informações"
          value={feedback.informacoes}
          onChange={handleInputChange}
        />
        <button type="button" onClick={cadastrarFeedback}>Cadastrar Feedback</button>
        <button type="button" onClick={() => obterFeedbacks()}>Obter todos os Feedbacks</button>
      </form>
      <input
        className="backend-url-input"
        type="text"
        placeholder="URL do Backend"
        value={backendURL}
        onChange={handleURLChange}
      />
      <ul>
        {feedbacks.map((f, index) => (
          <li key={index}>
            <div className="feedback-box">
              <div>ID: {f.ID}</div>
              <div>Classificação: {f.classificacao}</div>
              <div>Comentário: {f.comentario}</div>
              <div>Informações: {f.informacoes}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
