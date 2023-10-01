import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'Feedback'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Consulta todos os itens na tabela DynamoDB
        response = table.scan()
        items = response.get('Items', [])

        # Retorna os itens como resposta
        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Erro ao consultar o DynamoDB: {str(e)}')
        }
