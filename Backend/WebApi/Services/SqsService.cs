using Amazon.SQS;
using Amazon.SQS.Model;
using System.Text.Json;
namespace WebApi.Services
{
    public class SqsService
    {
        private readonly AmazonSQSClient _client;
        private readonly string _queueUrl;

        public SqsService(string queuUrl)
        {
            _client = new AmazonSQSClient();
            _queueUrl = queuUrl;
        }

        public async Task SendMessageAsync<T>(T message, string messageGroupId)
        {
            var jsonMessage = JsonSerializer.Serialize(message);
            var sendMessageRequest = new SendMessageRequest
            {
                QueueUrl = _queueUrl,
                MessageBody = jsonMessage,
                MessageGroupId = messageGroupId,
                MessageDeduplicationId = Guid.NewGuid().ToString()
            };

            await _client.SendMessageAsync(sendMessageRequest);
        }
    }
}
