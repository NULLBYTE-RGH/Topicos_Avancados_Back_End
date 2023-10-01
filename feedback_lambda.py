import json
import boto3
import logging

# Configuração do logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table_name = 'Feedback'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    # verificar o evento recebido
    logger.info(f'Evento Recebido: {json.dumps(event)}')

    # Extrair requisição
    try:
        body = event
        logger.info(f'CORPO: {body}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps('Erro: Formato JSON inválido no corpo da requisição.')
        }

    product_info = body.get('informacoes', {})
    user_feedback = {
        'ID': body.get('ID'),
        'Classificacao': body.get('classificacao'),
        'Comentario': body.get('comentario'),
        'Informacoes': body.get('informacoes')
    }

    # Validação do feedback 
    if not user_feedback['ID'] or not user_feedback['Classificacao'] or not user_feedback['Comentario']:
        return {
            'statusCode': 400,
            'body': json.dumps('Erro: Informações incompletas.')
        }

    # Armazena o feedback no DynamoDB
    try:
        response = table.put_item(
            Item={
                'ID': user_feedback['ID'],
                'Classificacao': user_feedback['Classificacao'],
                'Comentario': user_feedback['Comentario'],
                'Informacoes': user_feedback['Informacoes']
            }
        )
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Erro ao armazenar no DynamoDB: {str(e)}')
        }

    # Confirmação de feedback enviado com sucesso
    return {
        'statusCode': 200,
        'body': json.dumps('Feedback enviado com sucesso!')
    }
