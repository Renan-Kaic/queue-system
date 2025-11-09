'use client'
import Link from 'next/link'

export default function Page() {
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`

  return (
    <div className='flex flex-row min-h-screen w-full '>
      <div className='flex w-[50%] text-center items-center justify-center max-w-7xl mx-auto  '>
        <div className='flex flex-col items-center justify-center card card-border w-150 bg-base-100 '>
          <div className='w-full flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-s-black border-opacity-50 relative z-10'>
            <div className='max-w-[490px] flex flex-col gap-8'>
              {/* User Plus Icon */}
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M18 7.5V10.5M18 10.5V13.5M18 10.5H21M18 10.5H15M12.75 6.375C12.75 8.23896 11.239 9.75 9.375 9.75C7.51104 9.75 6 8.23896 6 6.375C6 4.51104 7.51104 3 9.375 3C11.239 3 12.75 4.51104 12.75 6.375ZM3.00092 19.2343C3.00031 19.198 3 19.1615 3 19.125C3 15.6042 5.85418 12.75 9.375 12.75C12.8958 12.75 15.75 15.6042 15.75 19.125V19.1276C15.75 19.1632 15.7497 19.1988 15.7491 19.2343C13.8874 20.3552 11.7065 21 9.375 21C7.04353 21 4.86264 20.3552 3.00092 19.2343Z'
                  stroke='#000000'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>

              {/* Title */}
              <h1 className='text-3xl text-start font-normal text-black'>
                Entre no <span className='font-bold text-primary'>Cronly</span>{' '}
                e organize seus horários escolares.
              </h1>

              {/* Description */}
              <p>
                Gerencie grades horárias, turmas e cronogramas de forma simples.
                Entre com sua conta Google e comece agora.
              </p>

              {/* Google Sign In Button */}
              <a href={googleAuthUrl}>
                <button className='h-14 w-full flex justify-center items-center bg-white border border-b-[3px] border-solid border-black text-black rounded-lg px-4 hover:border-b transition-all duration-75'>
                  {/* Google Icon */}
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 48 48'
                    className='w-6'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.223 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z'
                      fill='#FFC107'
                    />
                    <path
                      d='M6.30603 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.65603 8.337 6.30603 14.691Z'
                      fill='#FF3D00'
                    />
                    <path
                      d='M23.9999 44C29.1659 44 33.8599 42.023 37.4089 38.808L31.2189 33.57C29.1438 35.149 26.6075 36.0028 23.9999 36C18.7979 36 14.3809 32.683 12.7169 28.054L6.19495 33.079C9.50495 39.556 16.2269 44 23.9999 44Z'
                      fill='#4CAF50'
                    />
                    <path
                      d='M43.611 20.083H42V20H24V28H35.303C34.5142 30.2164 33.0934 32.1532 31.216 33.571L31.219 33.569L37.409 38.807C36.971 39.205 44 34 44 24C44 22.659 43.862 21.35 43.611 20.083Z'
                      fill='#1976D2'
                    />
                  </svg>
                  <span>Entrar com o Google</span>
                </button>
              </a>

              {/* Terms */}
              <p className='mt-6'>
                Criando uma conta, você concorda com todos os nossos{' '}
                <Link href='/termos' className='underline'>
                  termos e condições
                </Link>
                .
              </p>
            </div>
          </div>
          <div className='absolute inset-0 bg-white rounded-3xl border border-s-black border-opacity-30 transform translate-x-2 translate-y-2 rotate-2 z-0' />
          <div className='absolute inset-0 bg-white rounded-3xl border border-s-black border-opacity-30 transform translate-x-1 translate-y-1 rotate-1 z-0' />
        </div>
      </div>
    </div>
  )
}