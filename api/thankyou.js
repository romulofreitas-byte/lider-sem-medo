// ============================================
// WEBHOOK HANDLER PARA ASAAS
// Recebe notificações de pagamento do Asaas
// ============================================

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://riqslkibmvyalnwrapnj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcXNsa2libXZ5YWxud3JhcG5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI5OTg4MSwiZXhwIjoyMDc4ODc1ODgxfQ.A0jFOQ060NA7OyaoD4W3hmcRf9dCYZgLVbilIoUu6Ro';

// Criar cliente Supabase com service role key (bypassa RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Permitir apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Este endpoint aceita apenas requisições POST' 
    });
  }

  try {
    const webhookData = req.body;
    
    // Validar estrutura básica do webhook
    if (!webhookData || !webhookData.event || !webhookData.payment) {
      console.error('❌ Webhook inválido:', JSON.stringify(webhookData, null, 2));
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        message: 'Dados do webhook inválidos ou incompletos' 
      });
    }

    const { event, payment, dateCreated, id: eventId } = webhookData;

    // Log para debug
    console.log('📥 Webhook recebido:', {
      eventId,
      event,
      paymentId: payment.id,
      customerId: payment.customer,
      status: payment.status,
      value: payment.value,
      dateCreated
    });

    // Preparar dados para salvar no Supabase
    const paymentData = {
      event_id: eventId,
      event_type: event,
      payment_id: payment.id,
      customer_id: payment.customer,
      installment_id: payment.installment || null,
      checkout_session: payment.checkoutSession || null,
      payment_link: payment.paymentLink || null,
      value: payment.value || 0,
      net_value: payment.netValue || 0,
      original_value: payment.originalValue || null,
      interest_value: payment.interestValue || null,
      description: payment.description || null,
      billing_type: payment.billingType || null,
      confirmed_date: payment.confirmedDate || null,
      credit_card_number: payment.creditCard?.creditCardNumber || null,
      credit_card_brand: payment.creditCard?.creditCardBrand || null,
      status: payment.status,
      due_date: payment.dueDate || null,
      original_due_date: payment.originalDueDate || null,
      payment_date: payment.paymentDate || null,
      client_payment_date: payment.clientPaymentDate || null,
      installment_number: payment.installmentNumber || null,
      invoice_url: payment.invoiceUrl || null,
      invoice_number: payment.invoiceNumber || null,
      external_reference: payment.externalReference || null,
      deleted: payment.deleted || false,
      anticipated: payment.anticipated || false,
      anticipable: payment.anticipable || false,
      credit_date: payment.creditDate || null,
      estimated_credit_date: payment.estimatedCreditDate || null,
      transaction_receipt_url: payment.transactionReceiptUrl || null,
      nosso_numero: payment.nossoNumero || null,
      bank_slip_url: payment.bankSlipUrl || null,
      webhook_received_at: new Date().toISOString(),
      webhook_date_created: dateCreated || null,
      raw_data: webhookData // Salvar dados completos como JSON
    };

    // Salvar no Supabase
    const { data: savedPayment, error: dbError } = await supabase
      .from('pagamentos')
      .insert(paymentData)
      .select()
      .single();

    if (dbError) {
      console.error('❌ Erro ao salvar no Supabase:', dbError);
      
      // Se for erro de duplicata, ainda retornar sucesso (idempotência)
      if (dbError.code === '23505') { // Unique violation
        console.log('⚠️ Pagamento já existe no banco (idempotência)');
        return res.status(200).json({ 
          success: true,
          message: 'Webhook já processado anteriormente',
          duplicate: true
        });
      }
      
      // Para outros erros, logar mas ainda retornar 200 para evitar retentativas
      return res.status(200).json({ 
        success: false,
        error: 'Database error (logged)',
        message: 'Erro ao salvar no banco, mas webhook registrado'
      });
    }

    console.log('✅ Pagamento salvo com sucesso:', savedPayment.id);

    // Processar eventos específicos
    if (event === 'PAYMENT_CREATED' && payment.status === 'CONFIRMED') {
      console.log('💰 Pagamento confirmado! ID:', payment.id);
      // Aqui você pode adicionar lógica adicional:
      // - Enviar email de confirmação
      // - Atualizar status do cliente
      // - Integrar com outros sistemas
    }

    // Sempre retornar 200 para o Asaas
    // Isso evita que o Asaas tente reenviar o webhook
    return res.status(200).json({ 
      success: true,
      message: 'Webhook processado com sucesso',
      paymentId: payment.id,
      event: event
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    console.error('Stack trace:', error.stack);
    
    // Retornar 200 mesmo em caso de erro para evitar retentativas
    // Mas logar o erro para investigação
    return res.status(200).json({ 
      success: false,
      error: 'Internal error (logged)',
      message: 'Erro interno ao processar webhook, mas não será reenviado'
    });
  }
}

