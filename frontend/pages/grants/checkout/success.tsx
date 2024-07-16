import Head from "next/head"
import React from "react"
import { useRouter } from "next/router"
import axios from "../../../utils/axios"
import MainLayout from "../../../layouts/MainLayout"
import { useHasHydrated } from "../../../utils/useHydrated"
import Success from "../../../components/icons/Success"
import Button from "../../../components/Button"
import Link from "next/link"
import { useGrantCartStore } from "../../../utils/store"
import Image from "next/image"
import Copy from "../../../components/icons/Copy"
import { FacebookShareButton, TwitterShareButton } from "react-share"
import { toast } from "react-toastify"
import instance from "../../../utils/axios"

export default function CheckoutSuccess() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<any>(null) // Updated initial state to null
  const hasHydrated = useHasHydrated()
  const router = useRouter()
  const { clearCart } = useGrantCartStore()
  const shareInformation = React.useMemo(() => {
    if (typeof window !== undefined && data) {
      return {
        url: window.location.href,
        message: `#DigDAOマッチングドネーション実験 で${
          data.numberOfItems
        }件の公益プロジェクトに ${data.donated.toLocaleString(
          "ja-JP"
        )}円 分の寄付をしました！🥳 #Quadratic_Funding
        \n`,
      }
    }
  }, [data])

  const fetchMatchingAmountEstimate = async (
    donationAmount: number,
    grantId: string
  ) => {
    try {
      const response = await instance.get(
        `/qf/estimate?donationAmount=${donationAmount}&grantId=${grantId}`
      )
      return response.data // マッチング金額の見積もりが返される
    } catch (error) {
      console.error("マッチング金額の見積もり取得エラー:", error)
      return 0 // エラーが発生した場合は0を返す
    }
  }

  React.useEffect(() => {
    // If we have a session ID, we can make a call to the backend
    if (router.query.session_id) {
      setLoading(true)
      axios
        .get(`/checkout/${router.query.session_id}`)
        .then((res) => {
          const totalMatchingAmount =
            sessionStorage.getItem("totalMatchingAmount") || "0"
          setData({
            ...res.data,
            matched: parseInt(totalMatchingAmount, 10),
          })
          clearCart()
        })
        .catch((err) => {
          console.error("APIエラー:", err)
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Something went wrong",
            {
              toastId: "retrieve-grant-error",
            }
          )
          router.push("/pools")
        })
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, hasHydrated, router])

  return (
    <div>
      <Head>
        <title>Donation Successful</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout className="h-full min-h-screen items-center justify-center bg-sg-gradient">
        <Image
          src={"/assets/texture.svg"}
          alt=""
          fill
          className="object-cover pointer-events-none"
        />
        {hasHydrated && data && !loading && (
          <div className="flex flex-col w-full min-h-screen h-full items-center justify-center text-center">
            <Success className="fill-sg-success mb-6" />
            <h1 className="font-bold text-3xl mb-3">公益的な市民の鑑!</h1>
            <p className="text-2xl max-w-2xl mt-2 mb-10">
              あなたの <b>{data.donated.toLocaleString("ja-JP")}円</b>{" "}
              分の寄付を受け取りました。
              <br></br>
              {Math.round(data.matched) > 0 && (
                <>
                  この寄付に加え、約{" "}
                  <b>
                    {data.matched.toLocaleString("ja-JP", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    円
                  </b>
                  分の助成金が資金プールから上乗せされてプロジェクトに分配されます。
                </>
              )}
            </p>
            {shareInformation && (
              <>
                <Button
                  style="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                  className="mb-5"
                >
                  <Copy className="stroke-sg-secondary mr-2" />
                  リンクをコピー
                </Button>
                <div className="flex flex-row items-center justify-center w-full gap-6">
                  <TwitterShareButton
                    url={shareInformation.url}
                    title={shareInformation.message}
                  >
                    <p className="btn font-bold lg:text-lg px-4 md:px-12 py-3 h-max rounded-full normal-case btn-outline btn-secondary w-max">
                      Twitterでつぶやく
                    </p>
                  </TwitterShareButton>
                </div>
              </>
            )}

            <Link href="/grants">
              <Button className="mt-6" style="secondary">
                プロジェクト一覧へ戻る
              </Button>
            </Link>
          </div>
        )}
      </MainLayout>
    </div>
  )
}
