const deny = async () => false;
export const unavailableSubscription = Object.freeze({
  currentSubscription:null, creditsRemaining:null, creditsTotal:null, creditsUsed:null,
  isEligibleForRender:false, planColor:'#6B7280', renewalDate:null, loading:false,
  error:'Créditos no disponibles: el ledger canónico aún no está habilitado.',
  fetchUserSubscription:deny, deductCredit:deny, resetMonthlyCredits:deny,
  finalizeProject:deny, finalizeMiProyecto:deny,
});
