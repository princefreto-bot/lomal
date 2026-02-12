/**
 * ============================================
 * SERVICE PAYDUNYA - SIMULATION & PRODUCTION
 * ============================================
 * 
 * Ce fichier simule l'intégration PayDunya pour le développement
 * et est prêt pour la production avec les vraies API.
 * 
 * En production, remplacez SIMULATION_MODE = false
 * et ajoutez vos vraies clés PayDunya.
 */

// ============================================
// CONFIGURATION
// ============================================

const SIMULATION_MODE = true; // Mettre false en production

const PAYDUNYA_CONFIG = {
  // Clés de test (remplacer par vraies clés en production)
  masterKey: import.meta.env.VITE_PAYDUNYA_MASTER_KEY || 'test_master_key',
  privateKey: import.meta.env.VITE_PAYDUNYA_PRIVATE_KEY || 'test_private_key',
  publicKey: import.meta.env.VITE_PAYDUNYA_PUBLIC_KEY || 'test_public_key',
  token: import.meta.env.VITE_PAYDUNYA_TOKEN || 'test_token',
  mode: import.meta.env.VITE_PAYDUNYA_MODE || 'test', // 'test' ou 'live'
  
  // URLs de callback
  callbackUrl: import.meta.env.VITE_APP_URL + '/api/paydunya/callback',
  returnUrl: import.meta.env.VITE_APP_URL + '/subscription?status=success',
  cancelUrl: import.meta.env.VITE_APP_URL + '/subscription?status=cancelled',
};

// ============================================
// TYPES
// ============================================

export interface PaydunyaInvoice {
  id: string;
  reference: string;
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  paymentMethod: 'tmoney' | 'flooz' | 'card' | 'bank';
  createdAt: Date;
  completedAt?: Date;
  paydunyaToken?: string;
  paydunyaUrl?: string;
}

export interface PaydunyaPaymentRequest {
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: 'tmoney' | 'flooz' | 'card';
  metadata?: Record<string, string>;
}

export interface PaydunyaResponse {
  success: boolean;
  invoice?: PaydunyaInvoice;
  paymentUrl?: string;
  error?: string;
  message?: string;
}

// ============================================
// SIMULATION - Stockage local des transactions
// ============================================

const simulatedTransactions: Map<string, PaydunyaInvoice> = new Map();

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

/**
 * Génère une référence unique pour la transaction
 */
function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LOMAL-${timestamp}-${random}`;
}

/**
 * Crée une facture de paiement PayDunya
 */
export async function createPaydunyaInvoice(
  request: PaydunyaPaymentRequest
): Promise<PaydunyaResponse> {
  const reference = generateReference();
  
  if (SIMULATION_MODE) {
    // Mode simulation
    console.log('🔵 [PAYDUNYA SIMULATION] Création facture:', request);
    
    const invoice: PaydunyaInvoice = {
      id: `inv_${Date.now()}`,
      reference,
      amount: request.amount,
      description: request.description,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      customerEmail: request.customerEmail,
      status: 'pending',
      paymentMethod: request.paymentMethod,
      createdAt: new Date(),
      paydunyaToken: `sim_token_${Date.now()}`,
      paydunyaUrl: `#payment-simulation-${reference}`,
    };
    
    simulatedTransactions.set(reference, invoice);
    
    return {
      success: true,
      invoice,
      paymentUrl: invoice.paydunyaUrl,
      message: 'Facture créée avec succès (simulation)',
    };
  }
  
  // Mode production - Appel API PayDunya réel
  try {
    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_CONFIG.masterKey,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_CONFIG.privateKey,
        'PAYDUNYA-TOKEN': PAYDUNYA_CONFIG.token,
      },
      body: JSON.stringify({
        invoice: {
          total_amount: request.amount,
          description: request.description,
        },
        store: {
          name: 'LOMAL IMMOBILIER',
          tagline: 'Trouvez votre chambre idéale à Lomé',
          phone: '+228 90 00 00 00',
          website_url: 'https://lomal-immobilier.com',
        },
        custom_data: {
          reference,
          customer_name: request.customerName,
          customer_phone: request.customerPhone,
          ...request.metadata,
        },
        actions: {
          callback_url: PAYDUNYA_CONFIG.callbackUrl,
          return_url: PAYDUNYA_CONFIG.returnUrl,
          cancel_url: PAYDUNYA_CONFIG.cancelUrl,
        },
      }),
    });
    
    const data = await response.json();
    
    if (data.response_code === '00') {
      const invoice: PaydunyaInvoice = {
        id: data.token,
        reference,
        amount: request.amount,
        description: request.description,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        status: 'pending',
        paymentMethod: request.paymentMethod,
        createdAt: new Date(),
        paydunyaToken: data.token,
        paydunyaUrl: data.response_text,
      };
      
      return {
        success: true,
        invoice,
        paymentUrl: data.response_text,
      };
    }
    
    return {
      success: false,
      error: data.response_text || 'Erreur lors de la création de la facture',
    };
  } catch (error) {
    console.error('Erreur PayDunya:', error);
    return {
      success: false,
      error: 'Erreur de connexion au service de paiement',
    };
  }
}

/**
 * Simule le processus de paiement Mobile Money
 */
export async function simulateMobileMoneyPayment(
  reference: string,
  _pin?: string
): Promise<PaydunyaResponse> {
  if (!SIMULATION_MODE) {
    return {
      success: false,
      error: 'Cette fonction est uniquement disponible en mode simulation',
    };
  }
  
  const invoice = simulatedTransactions.get(reference);
  
  if (!invoice) {
    return {
      success: false,
      error: 'Transaction non trouvée',
    };
  }
  
  console.log('🔵 [PAYDUNYA SIMULATION] Traitement paiement:', reference);
  
  // Simulation du délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulation: 95% de succès, 5% d'échec
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    invoice.status = 'completed';
    invoice.completedAt = new Date();
    simulatedTransactions.set(reference, invoice);
    
    console.log('✅ [PAYDUNYA SIMULATION] Paiement réussi:', reference);
    
    return {
      success: true,
      invoice,
      message: 'Paiement effectué avec succès',
    };
  } else {
    invoice.status = 'failed';
    simulatedTransactions.set(reference, invoice);
    
    console.log('❌ [PAYDUNYA SIMULATION] Paiement échoué:', reference);
    
    return {
      success: false,
      invoice,
      error: 'Le paiement a échoué. Veuillez réessayer.',
    };
  }
}

/**
 * Vérifie le statut d'une transaction
 */
export async function checkPaymentStatus(reference: string): Promise<PaydunyaResponse> {
  if (SIMULATION_MODE) {
    const invoice = simulatedTransactions.get(reference);
    
    if (!invoice) {
      return {
        success: false,
        error: 'Transaction non trouvée',
      };
    }
    
    return {
      success: true,
      invoice,
    };
  }
  
  // Mode production
  try {
    const invoice = simulatedTransactions.get(reference);
    
    if (!invoice?.paydunyaToken) {
      return {
        success: false,
        error: 'Token de transaction non trouvé',
      };
    }
    
    const response = await fetch(
      `https://app.paydunya.com/api/v1/checkout-invoice/confirm/${invoice.paydunyaToken}`,
      {
        headers: {
          'PAYDUNYA-MASTER-KEY': PAYDUNYA_CONFIG.masterKey,
          'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_CONFIG.privateKey,
          'PAYDUNYA-TOKEN': PAYDUNYA_CONFIG.token,
        },
      }
    );
    
    const data = await response.json();
    
    if (data.status === 'completed') {
      invoice.status = 'completed';
      invoice.completedAt = new Date();
    } else if (data.status === 'cancelled') {
      invoice.status = 'cancelled';
    }
    
    return {
      success: true,
      invoice,
    };
  } catch (error) {
    console.error('Erreur vérification PayDunya:', error);
    return {
      success: false,
      error: 'Erreur lors de la vérification du paiement',
    };
  }
}

/**
 * Annule une transaction en attente
 */
export async function cancelPayment(reference: string): Promise<PaydunyaResponse> {
  const invoice = simulatedTransactions.get(reference);
  
  if (!invoice) {
    return {
      success: false,
      error: 'Transaction non trouvée',
    };
  }
  
  if (invoice.status !== 'pending') {
    return {
      success: false,
      error: 'Cette transaction ne peut plus être annulée',
    };
  }
  
  invoice.status = 'cancelled';
  simulatedTransactions.set(reference, invoice);
  
  console.log('🔵 [PAYDUNYA SIMULATION] Paiement annulé:', reference);
  
  return {
    success: true,
    invoice,
    message: 'Paiement annulé',
  };
}

/**
 * Récupère l'historique des transactions (simulation)
 */
export function getTransactionHistory(): PaydunyaInvoice[] {
  return Array.from(simulatedTransactions.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

/**
 * Formate le montant en FCFA
 */
export function formatCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Obtient l'icône/nom du provider selon la méthode
 */
export function getPaymentMethodInfo(method: string): { name: string; color: string } {
  switch (method) {
    case 'tmoney':
      return { name: 'T-Money (Togocel)', color: '#00A651' };
    case 'flooz':
      return { name: 'Flooz (Moov)', color: '#0066B3' };
    case 'card':
      return { name: 'Carte Bancaire', color: '#1A1A1A' };
    default:
      return { name: 'Mobile Money', color: '#666666' };
  }
}
