# Script de teste para webhook do Asaas
# Uso: .\test-webhook.ps1

$uri = "https://lider-sem-medo.vercel.app/thankyou"
$headers = @{
    "Content-Type" = "application/json"
}

# Dados de teste do webhook
$body = @{
    id = "evt_test_123456"
    event = "PAYMENT_CREATED"
    dateCreated = "2025-12-08 16:30:27"
    payment = @{
        object = "payment"
        id = "pay_test_123456"
        dateCreated = "2025-12-08"
        customer = "cus_test_123456"
        value = 14.95
        netValue = 14.19
        description = "Teste de webhook"
        billingType = "CREDIT_CARD"
        confirmedDate = "2025-12-08"
        creditCard = @{
            creditCardNumber = "6926"
            creditCardBrand = "MASTERCARD"
        }
        status = "CONFIRMED"
        dueDate = "2025-12-08"
        originalDueDate = "2025-12-08"
        clientPaymentDate = "2025-12-08"
        installmentNumber = 1
        invoiceUrl = "https://www.asaas.com/i/test"
        invoiceNumber = "696729094"
        deleted = $false
        anticipated = $false
        anticipable = $false
        creditDate = "2026-01-09"
        estimatedCreditDate = "2026-01-09"
        transactionReceiptUrl = "https://www.asaas.com/comprovantes/test"
        discount = @{
            value = 0
            type = "FIXED"
        }
        fine = @{
            value = 0
            type = "FIXED"
        }
        interest = @{
            value = 0
            type = "PERCENTAGE"
        }
        postalService = $false
    }
} | ConvertTo-Json -Depth 10

Write-Host "🚀 Enviando webhook de teste..." -ForegroundColor Cyan
Write-Host "URL: $uri" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resposta:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "❌ Erro!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Resposta do servidor:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}

