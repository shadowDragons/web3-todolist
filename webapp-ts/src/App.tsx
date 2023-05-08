import './App.css';
import { ethers, Contract, BrowserProvider, JsonRpcSigner } from "ethers";
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Space, Input, Layout, Menu, Button, List, Checkbox, Avatar, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import todojson from './contract-build/contracts/Todo.sol/Todo.json';
import type { MenuProps } from 'antd';
const { Text, Paragraph } = Typography;

const { Header, Content, Sider } = Layout;

type dataItem = {
  id: number;
  content: string;
  status: number;
}

type eventObj = {
  eventName: string;
}

const App : React.FC = () => {

  const [account, setAccount] = useState<string | null>();
  const [signer, setSigner] = useState<JsonRpcSigner | null>();
  const [provider, setProvider] = useState<BrowserProvider | null>();
  const [todoContract, setTodoContract] = useState<Contract | null>();
  const [selectStatus, setSelectStatus] = useState<number | null>(0);

  const [newTodoText, setNewTodoText] = useState<string>("");
  const [data, setData] = useState<dataItem[]>();

  useEffect(() => {
    async function initChain() {
      if (signer) {
        const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        let contract = new ethers.Contract(address, todojson.abi, signer);
        setTodoContract(contract);
      }
    }
    initChain();
  }, [provider, signer]);

  useEffect(() => {
    getList()
  }, [selectStatus, todoContract]);

  async function getList() {
    if (todoContract) {
      const rs = await todoContract.list(selectStatus);
      let list : dataItem[] = [];
      rs[0].forEach(function(item :number, key:number) {
        list.push({
          "id": item, 
          "content": ethers.decodeBytes32String(rs[1][key]), 
          "status": rs[2][key]
        })
      })
      setData(list);
    }
  }

  async function conncetWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider);

    const signer = await provider.getSigner();
    console.log(signer.address)
    setAccount(signer.address)
    setSigner(signer);
  };

  function disconnect()
  {
    setAccount(null)
    setSigner(null);
  }

  async function addTodo()
  {
    const tx = await todoContract?.add(ethers.encodeBytes32String(newTodoText));
    const rc = await tx.wait();
    const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Add';})

    if (event) {
      console.log("add success");
    } else {
      console.log("add fail");
    }
    getList();
  } 

  async function checkTodo(id:number)
  {
    const tx = await todoContract?.checked(id);
    const rc = await tx.wait();
    const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Checked';})

    if (event) {
      console.log("check success");
    } else {
      console.log("check fail");
    }
    getList();
  } 

  async function delTodo(id:number)
  {
    const tx = await todoContract?.del(id);
    const rc = await tx.wait();
    const event = rc.logs.find((obj:eventObj) => {return obj.eventName === 'Del';})

    if (event) {
      console.log("del success");
    } else {
      console.log("del fail");
    }
    getList();
  }

  const changeSelectStatus: MenuProps['onClick'] = (e) => 
  {
    if (e.key === 'UnChecked') {
      setSelectStatus(0)
    } else {
      setSelectStatus(1)
    }
  }
  
  return (
    <Provider store={store}>
      <Layout style={{height: '100vh'}}>
        <Header className="header" style={{textAlign: "right"}}>
            {account ? 
              <Space align="baseline">
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                
                  <Paragraph copyable={{text: account}}>
                    <Text style={{color: 'white'}}>{account}</Text>
                  </Paragraph>

                <Button onClick={() => {disconnect()}}>disconnect</Button>
            </Space> :
            <Button onClick={() => {conncetWallet()}}>connect to wallet</Button>
          }
        </Header>
        <Content
          style={{
            padding: '0 50px',
          }}
        >
          <Space align="baseline" style={{
              padding: '24px 0',
              textAlign: 'center'
            }}>
            <Input placeholder="input something to do"  onChange={(evt) => {
                setNewTodoText(evt.target.value)
            }} value={newTodoText}/>
            <Button type="primary" onClick={() => {addTodo()}}>Add</Button>
          </Space>
          <Layout
            style={{
              padding: '24px 0'
            }}
          >
            <Sider
              width={200}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{
                  height: '100%',
                }}
                onClick={(e) => changeSelectStatus(e)}
                items={
                  [{
                    key: `UnChecked`,
                    icon: React.createElement(ExclamationCircleFilled),
                    label: `UnChecked >>`,
                  },
                  {
                    key: `Checked`,
                    icon: React.createElement(CheckCircleFilled),
                    label: `Checked >>`,
                  }]
                }
              />
            </Sider>
            <Content
              style={{
                padding: '0 24px',
                minHeight: 280,
              }}
            >
            <List
                  bordered
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item
                      actions={item.status !== 2 ? 
                        [<a key="list-loadmore-edit" onClick={() => {delTodo(item.id)}}>del</a>] 
                        : 
                        []
                      }
                    >
                      {item.status == 0 ?
                        <Checkbox onChange={() => {
                          checkTodo(item.id)
                        }}>{item.content}</Checkbox>
                        :
                        <Text delete>{item.content}</Text>
                      }
                    </List.Item>
                  )}
                />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Provider>
  );
};
export default App;