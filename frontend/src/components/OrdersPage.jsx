import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const orders = [
  { id: '#CB98621', date: 'May 10, 2024', status: 'Delivered', items: 2, price: '£72.00', color: 'text-green-600 bg-green-50' },
  { id: '#CB98622', date: 'May 05, 2024', status: 'Shipped', items: 3, price: '£55.00', color: 'text-blue-600 bg-blue-50' },
  { id: '#CB98623', date: 'Apr 28, 2024', status: 'Delivered', items: 4, price: '£120.00', color: 'text-green-600 bg-green-50' },
  { id: '#CB98624', date: 'Apr 20, 2024', status: 'Cancelled', items: 1, price: '£45.00', color: 'text-red-600 bg-red-50' }
]

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-[20px] font-bold text-gray-900">My Orders</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[61px] z-40 overflow-x-auto no-scrollbar">
        <div className="flex px-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-[14px] font-bold transition-all relative ${activeTab === tab ? 'text-[#006D6D]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006D6D] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[15px] font-bold text-gray-900">Order {order.id}</h3>
                  <p className="text-[12px] text-gray-400 font-medium">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${order.color}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex justify-between items-end mt-6">
                <div className="flex flex-col gap-3">
                  <span className="text-[14px] text-gray-600 font-bold">{order.items} {order.items === 1 ? 'Item' : 'Items'}</span>
                  <button className="flex items-center gap-1 text-[#006D6D] text-[13px] font-bold hover:underline">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <span className="text-[20px] font-black text-gray-900">{order.price}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-gray-800">No orders found</h3>
            <p className="text-[13px] text-gray-400 mt-1">Looks like you haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
