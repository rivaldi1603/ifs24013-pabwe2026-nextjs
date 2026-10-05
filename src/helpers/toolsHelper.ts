import Swal from 'sweetalert2';

export const showSuccessDialog = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#3b82f6', // tailwind blue-500
  });
};

export const showErrorDialog = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444', // tailwind red-500
  });
};

export const showWarningDialog = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#f59e0b', // tailwind amber-500
  });
};

export const showConfirmDialog = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString));
};
