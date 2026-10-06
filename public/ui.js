export const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value??'') ? value.split('-').reverse().join('.') : String(value??'');
export function download(name,content,type='text/plain;charset=utf-8') {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
