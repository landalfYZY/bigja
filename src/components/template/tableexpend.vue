<template>
    <div>
        <Row :gutter="20" >
            <Col :span="12" v-for="item in row" :key="item.sunwouId" class="panel-start">
                <div >{{item.productName}}</div>
                <div style="margin-left:10px"><span v-for="item1 in item.attribute" :key="item1.name">{{item1.name+' '}} </span></div>
                <div style="margin-left:10px">x{{item.number}}</div>
                <div style="margin-left:10px">￥{{item.productAmount}}</div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Array
        }
    };
</script>