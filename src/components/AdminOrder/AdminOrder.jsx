import React, { useRef } from 'react'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import * as OrderService from '../../services/OrderService'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'
import { convertPrice } from '../../utils'

const AdminOrder = () => {
      const user = useSelector((state) => state?.user)
      const searchInput = useRef(null);


      const getAllOrder = async () => {
            const res = await OrderService.getAllOrder(user?.access_token)
            return res
      }


      const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
      const { isLoading: isLoadingOrders, data: orders } = queryOrder

      const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();

      };
      const handleReset = (clearFilters) => {
            clearFilters();

      };

      const getColumnSearchProps = (dataIndex) => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                  <div
                        style={{
                              padding: 8,
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                  >
                        <Input
                              ref={searchInput}
                              placeholder={`Search ${dataIndex}`}
                              value={selectedKeys[0]}
                              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                              style={{
                                    marginBottom: 8,
                                    display: 'block',
                              }}
                        />
                        <Space>
                              <Button
                                    type="primary"
                                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                                    icon={<SearchOutlined />}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Search
                              </Button>
                              <Button
                                    onClick={() => clearFilters && handleReset(clearFilters)}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Reset
                              </Button>
                        </Space>
                  </div>
            ),
            filterIcon: (filtered) => (
                  <SearchOutlined
                        style={{
                              color: filtered ? '#1890ff' : undefined,
                        }}
                  />
            ),
            onFilter: (value, record) =>
                  record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                  if (visible) {
                        setTimeout(() => searchInput.current?.select(), 100);
                  }
            },

      });

      const columns = [
            {
                  title: 'User name',
                  dataIndex: 'userName',
                  sorter: (a, b) => a.userName.length - b.userName.length,
                  ...getColumnSearchProps('userName')
            },
            {
                  title: 'Phone',
                  dataIndex: 'phone',
                  sorter: (a, b) => a.phone.length - b.phone.length,
                  ...getColumnSearchProps('phone')
            },
            {
                  title: 'Address',
                  dataIndex: 'address',
                  sorter: (a, b) => a.address.length - b.address.length,
                  ...getColumnSearchProps('address')
            },
            {
                  title: 'Paided',
                  dataIndex: 'isPaid',
                  sorter: (a, b) => a.isPaid.length - b.isPaid.length,
                  ...getColumnSearchProps('isPaid')
            },
            {
                  title: 'Shipped',
                  dataIndex: 'isDelivered',
                  sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
                  ...getColumnSearchProps('isDelivered')
            },
            {
                  title: 'Payment method',
                  dataIndex: 'paymentMethod',
                  sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
                  ...getColumnSearchProps('paymentMethod')
            },
            {
                  title: 'Total price',
                  dataIndex: 'totalPrice',
                  sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
                  ...getColumnSearchProps('totalPrice')
            },
      ];

      const dataTable = orders?.data?.length && orders?.data?.map((order) => {
            console.log('usewr', order)
            return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice) }
      })
      return (
            <div>
                  <div>
                        <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
                        <div style={{ height: 200, width: 200 }}>
                              <PieChartComponent data={orders?.data} />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                              <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
                        </div>
                  </div>
            </div>
      )
}

export default AdminOrder